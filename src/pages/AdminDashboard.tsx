// src/pages/AdminDashboard.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ id: number; name: string; multiplier: number } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // GET: Lista actual de Pokémon en las slots (ordenada por multiplicador descendente)
  const { data: currentPokemons = [], isLoading: loadingCurrent } = useQuery({
    queryKey: ['pokemons'],
    queryFn: api.getPokemons,
    select: (data) => data.sort((a: any, b: any) => b.multiplier - a.multiplier),
  })

  // GET: TODOS los Pokémon de PokéAPI (para la lupa)
  const { data: allPokemons = [], isLoading: loadingAll } = useQuery({
    queryKey: ['all-pokemons'],
    queryFn: async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
      const data = await res.json()
      return data.results.map((p: any, index: number) => ({
        id: index + 1,
        name: p.name,
      }))
    },
  })

  // PUT: Actualizar Pokémon en la slot seleccionada
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; multiplier: number } }) =>
      api.updatePokemon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemons'] }) // recarga completa de la tabla
      setShowModal(false)
      setSelectedSlot(null)
      setSearchTerm('')
    },
  })

  // Función para obtener sprite animado dinámico (usa SOLO el nombre actualizado)
  const getAnimatedSprite = (name: string) => {
    const lowerName = name.toLowerCase()
    // Usamos Showdown para todos (más fiable para formas especiales y Megas)
    return `https://play.pokemonshowdown.com/sprites/xyani/${lowerName}.gif?v=${Date.now()}` // cache-busting con timestamp
  }

  const handleChangeClick = (slot: { id: number; name: string; multiplier: number }) => {
    setSelectedSlot(slot)
    setShowModal(true)
  }

  const handleSelectPokemon = (newPokemon: { id: number; name: string }) => {
    if (!selectedSlot) return

    updateMutation.mutate({
      id: selectedSlot.id,
      data: { name: newPokemon.name, multiplier: selectedSlot.multiplier },
    })
  }

  // Filtrado en tiempo real (case-insensitive)
  const filteredPokemons = allPokemons.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loadingCurrent || loadingAll) return <div className="loading">Cargando Pokémon...</div>

  return (
    <div className="admin-dashboard">
      <h1 className="title">Panel de Administración - {user?.name || 'Admin'}</h1>
      <p className="subtitle">Gestiona los Pokémon de las tragaperras</p>

      {/* Tabla de Pokémon actuales */}
      <div className="pokemon-table-container">
        <table className="pokemon-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Multiplicador</th>
              <th>Sprite</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentPokemons.map((p: any) => (
              <tr key={`${p.id}-${p.name}-${Date.now()}`}> {/* clave única dinámica: fuerza re-render de la fila completa al cambiar nombre */}
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.multiplier}x</td>
                <td>
                  <img
                    key={`${p.id}-${p.name}-${Date.now()}`} // clave única dinámica: fuerza re-mount del <img> al cambiar nombre
                    src={getAnimatedSprite(p.name)}
                    alt={p.name}
                    className="table-sprite"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/60?text=?'
                    }}
                  />
                </td>
                <td>
                  <button onClick={() => handleChangeClick(p)} className="change-btn">
                    Cambiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal tipo lupa */}
      {showModal && (
        <div className="lupa-modal">
          <div className="lupa-modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ×
            </button>

            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="pokemon-grid">
              {filteredPokemons.length === 0 ? (
                <p className="no-results">No se encontraron Pokémon</p>
              ) : (
                filteredPokemons.map((p: any) => (
                  <div key={p.id} className="pokemon-card" onClick={() => handleSelectPokemon(p)}>
                    <img
                      src={getAnimatedSprite(p.name)}
                      alt={p.name}
                      className="pokemon-sprite-large"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/100?text=?'
                      }}
                    />
                    <p className="pokemon-name-large">{p.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}