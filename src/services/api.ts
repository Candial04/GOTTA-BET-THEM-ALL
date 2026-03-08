// src/services/api.ts

const API_BASE = 'http://localhost:3001';  // json-server local
const POKE_API = 'https://pokeapi.co/api/v2';  // ← añadida (falta en tu código)
const FAKE_BETS_API = 'https://jsonplaceholder.typicode.com/posts';  // ← añadida (falta en tu código)

export const api = {
  /**
   * Inicia sesión con email y contraseña (contra json-server local)
   * Devuelve token fake + role del usuario
   */
  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: Fallo en la conexión al backend local`);
      }

      const users = await res.json();

      if (users.length === 0) {
        throw new Error('Credenciales inválidas');
      }

      const user = users[0];

      // Token fake
      const fakeToken = `fake-jwt-${user.id}-${Date.now()}`;

      return {
        token: fakeToken,
        role: user.role,
        user: { email: user.email, name: user.name || email.split('@')[0] }
      };
    } catch (error) {
      console.error('[api.login] Error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Error al intentar iniciar sesión');
    }
  },

  /**
   * Obtiene N Pokémon aleatorios
   */
  getRandomPokemon: async (count = 3) => {
    try {
      const ids = Array.from({ length: count }, () => 
        Math.floor(Math.random() * 1025) + 1
      );

      const promises = ids.map(id => 
        fetch(`${POKE_API}/pokemon/${id}`)
          .then(res => {
            if (!res.ok) throw new Error(`Pokémon ${id} no encontrado`);
            return res.json();
          })
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error('[api.getRandomPokemon] Error:', error);
      throw new Error('No se pudieron cargar los Pokémon');
    }
  },

  /**
   * Registra apuesta (simulación POST a jsonplaceholder)
   */
  recordBet: async (betData: any) => {
    try {
      const res = await fetch(FAKE_BETS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...betData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('[api.recordBet] Fallo en simulación:', error);
      return { success: false };
    }
  },

  // CRUD para pokemons (ya lo tenías, lo dejo igual)
  getPokemons: async () => {
    try {
      const res = await fetch(`${API_BASE}/pokemons`);
      if (!res.ok) throw new Error('Error al obtener Pokémon');
      return await res.json();
    } catch (error) {
      console.error('[api.getPokemons] Error:', error);
      throw new Error('No se pudieron cargar los Pokémon');
    }
  },

  addPokemon: async (pokemon: { id: number; name: string; multiplier: number }) => {
    try {
      const res = await fetch(`${API_BASE}/pokemons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pokemon),
      });
      if (!res.ok) throw new Error('Error al añadir Pokémon');
      return await res.json();
    } catch (error) {
      console.error('[api.addPokemon] Error:', error);
      throw new Error('No se pudo añadir el Pokémon');
    }
  },

  updatePokemon: async (id: number, pokemon: { name: string; multiplier: number }) => {
    try {
      const res = await fetch(`${API_BASE}/pokemons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pokemon),
      });
      if (!res.ok) throw new Error('Error al editar Pokémon');
      return await res.json();
    } catch (error) {
      console.error('[api.updatePokemon] Error:', error);
      throw new Error('No se pudo editar el Pokémon');
    }
  },

  deletePokemon: async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/pokemons/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar Pokémon');
      return true;
    } catch (error) {
      console.error('[api.deletePokemon] Error:', error);
      throw new Error('No se pudo eliminar el Pokémon');
    }
  },
};

export default api;