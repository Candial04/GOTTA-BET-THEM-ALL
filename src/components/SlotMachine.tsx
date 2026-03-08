// src/components/SlotMachine.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { useCasinoStore } from '../store/useCasinoStore'
import './SlotMachine.css'

export default function SlotMachine() {
  const [reels, setReels] = useState<any[][]>([[], [], []]) // 3 columnas, cada una con 3 Pokémon
  const [spinning, setSpinning] = useState(false)
  const [bet, setBet] = useState(50)
  const [message, setMessage] = useState('')
  const [lastPrize, setLastPrize] = useState(0) // Premio acumulado para mostrar arriba

  const { balance, loseCoins, winCoins, addBet } = useCasinoStore()

  // Carga dinámica de la lista de Pokémon desde el backend (json-server)
  const { data: pokemonList = [], isLoading } = useQuery({
    queryKey: ['pokemons'],
    queryFn: api.getPokemons,
  })

  // Función para obtener sprite animado dinámico (usa SOLO el nombre actualizado)
  const getAnimatedSprite = (name: string) => {
    const lowerName = name.toLowerCase()
    // Usamos Showdown para todos (más fiable para formas especiales y Megas)
    return `https://play.pokemonshowdown.com/sprites/xyani/${lowerName}.gif?v=${Date.now()}` // cache-busting con timestamp
  }

  const spin = async () => {
    if (spinning || balance < bet || isLoading || pokemonList.length === 0) return

    setSpinning(true)
    setMessage('')
    loseCoins(bet)

    // Seleccionamos 3 columnas, cada una con 3 Pokémon aleatorios del backend
    const newReels = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () =>
        pokemonList[Math.floor(Math.random() * pokemonList.length)]
      )
    )

    // Obtenemos sprites animados para todos los Pokémon
    const allPromises = newReels.flat().map(p =>
      fetch(getAnimatedSprite(p.name))
        .then(res => res.url)
        .catch(() => 'https://via.placeholder.com/100?text=?') // fallback si falla algún sprite
    )
    const spriteUrls = await Promise.all(allPromises)

    // Asignamos sprites a cada posición
    const reelsWithSprites = newReels.map((column, colIndex) =>
      column.map((p, rowIndex) => ({
        ...p,
        sprite: spriteUrls[colIndex * 3 + rowIndex]
      }))
    )

    setReels(reelsWithSprites)

    // Calculamos premio (línea central) usando multiplicadores del backend
    const centerLine = reelsWithSprites.map(column => column[1].name)
    let multiplier = 0

    if (centerLine[0] === centerLine[1] && centerLine[1] === centerLine[2]) {
      multiplier = pokemonList.find((p: any) => p.name === centerLine[0])?.multiplier || 1
      multiplier *= 10 // jackpot
    } else if (centerLine[0] === centerLine[1] || centerLine[1] === centerLine[2] || centerLine[0] === centerLine[2]) {
      multiplier = pokemonList.find((p: any) => p.name === centerLine[1])?.multiplier || 1
      multiplier *= 3 // premio menor
    }

    const win = bet * multiplier

    // Mostramos mensaje y actualizamos premio SOLO al final de la animación
    setTimeout(() => {
      if (win > 0) {
        winCoins(win)
        setLastPrize(win)
        setMessage(`¡GANASTE ${win} monedas!`)
      } else {
        setLastPrize(0)
        setMessage('Mejor suerte la próxima...')
      }
      setSpinning(false)
    }, 2500) // 2.5 segundos para animación completa

    addBet({ amount: bet, result: centerLine.join(' • '), win })
  }

  return (
    <div className="slot-machine">
      {/* Fondo de la tragaperras */}
      <div className="machine-background"></div>

      {/* Tabla de premios a la izquierda - ahora dinámica desde backend */}
      <div className="prize-table">
        <h3>Premios</h3>
        <table>
          <thead>
            <tr>
              <th>Combinación</th>
              <th>Multiplicador</th>
            </tr>
          </thead>
          <tbody>
            {pokemonList
              .sort((a: any, b: any) => b.multiplier - a.multiplier)
              .map((p: any, i: number) => (
                <tr key={i}>
                  <td>3 {p.name}</td>
                  <td>{p.multiplier * 10}x</td>
                </tr>
              ))}
            <tr>
              <td>2 iguales (cualquier)</td>
              <td>3x</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Crédito y Premio en la zona superior de la máquina */}
      <div className="top-display">
        <div className="credit">
          <span>CRÉDITO</span>
          <div className="value">{balance}</div>
        </div>
        <div className="prize">
          <span>PREMIO</span>
          <div className="value">{lastPrize}</div>
        </div>
      </div>

      {/* Contenedor de los 3 reels - NO TOCO NADA DE TU CSS ORIGINAL */}
      <div className={`reels-container ${spinning ? 'spinning' : ''}`}>
        {reels.map((column, colIndex) => (
          <div key={colIndex} className="reel-column">
            {column.map((p: any, rowIndex: number) => (
              <div key={`${colIndex}-${rowIndex}-${p.name}`} className="reel-item">
                <img
                  key={`${colIndex}-${rowIndex}-${p.name}-${Date.now()}`} // clave ultra única: fuerza re-mount del <img> al cambiar nombre
                  src={getAnimatedSprite(p.name)}
                  alt={p.name}
                  className="reel-image"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100?text=?'
                  }}
                />
                <p className="pokemon-name">{p.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="controls">
        <div className="bet-control">
          <label>Apuesta:</label>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Math.max(10, Number(e.target.value)))}
            disabled={spinning}
          />
        </div>

        <button onClick={spin} disabled={spinning || balance < bet} className="spin-btn">
          {spinning ? '¡GIRANDO!' : '¡GIRAR!'}
        </button>
      </div>

      {message && <p className="result-message">{message}</p>}
    </div>
  )
}