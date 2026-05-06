import { useState, useEffect } from 'react'
import { subscribeMovies, addMovie, updateMovie, deleteMovie, markWatched, firebaseEnabled } from './storage.js'
import MovieCard from './components/MovieCard.jsx'
import MovieModal from './components/MovieModal.jsx'

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'vistas', label: 'Vistas' },
  { id: 'cine', label: '🎬 Cine' },
  { id: 'casa', label: '🏠 Casa' },
]

export default function App() {
  const [movies, setMovies] = useState([])
  const [filter, setFilter] = useState('todas')
  const [showModal, setShowModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeMovies(data => {
      setMovies(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const counts = {
    todas: movies.length,
    pendientes: movies.filter(m => m.status === 'pendiente').length,
    vistas: movies.filter(m => m.status === 'vista').length,
    cine: movies.filter(m => m.location === 'cine').length,
    casa: movies.filter(m => m.location === 'casa').length,
  }

  const filtered = movies.filter(m => {
    if (filter === 'todas') return true
    if (filter === 'pendientes') return m.status === 'pendiente'
    if (filter === 'vistas') return m.status === 'vista'
    if (filter === 'cine') return m.location === 'cine'
    if (filter === 'casa') return m.location === 'casa'
    return true
  })

  const handleSave = async (data) => {
    if (editingMovie) {
      await updateMovie(editingMovie.id, data)
    } else {
      await addMovie(data)
    }
    setShowModal(false)
    setEditingMovie(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta película?')) {
      await deleteMovie(id)
    }
  }

  const handleMarkWatched = async (movie) => {
    await markWatched(movie.id)
  }

  const openAdd = () => {
    setEditingMovie(null)
    setShowModal(true)
  }

  const openEdit = (movie) => {
    setEditingMovie(movie)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl shrink-0">🎬</span>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">Nuestras Películas</h1>
              <p className="text-xs text-slate-400 truncate">
                {counts.todas} total · {counts.vistas} vistas · {counts.pendientes} pendientes
                {!firebaseEnabled && (
                  <span className="ml-2 text-amber-400">· solo este dispositivo</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
          >
            <span className="text-base leading-none">+</span>
            <span>Agregar</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!firebaseEnabled && (
          <div className="mb-5 bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 text-sm text-amber-300">
            <strong>Modo local:</strong> las películas se guardan solo en este dispositivo. Configura Firebase en{' '}
            <code className="bg-amber-950/60 px-1 rounded">.env</code> para sincronizar con tu pareja.{' '}
            <a href="https://github.com/erickguerra2/control-pel-culas#readme" target="_blank" rel="noreferrer" className="underline">
              Ver instrucciones
            </a>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon="📽️" label="Total" value={counts.todas} />
          <StatCard icon="🕐" label="Pendientes" value={counts.pendientes} color="text-amber-400" />
          <StatCard icon="✅" label="Vistas" value={counts.vistas} color="text-emerald-400" />
          <StatCard icon="🎬" label="En el cine" value={counts.cine} color="text-sky-400" />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
              {f.id !== 'todas' && (
                <span className="ml-1.5 text-xs opacity-70">({counts[f.id]})</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-4xl mb-3 animate-pulse">🍿</p>
            <p>Cargando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <p className="text-5xl mb-4">🍿</p>
            <p className="text-lg font-medium">No hay películas aquí todavía</p>
            {filter === 'todas' ? (
              <button onClick={openAdd} className="mt-4 text-rose-400 hover:text-rose-300 text-sm underline">
                Agrega la primera
              </button>
            ) : (
              <button onClick={() => setFilter('todas')} className="mt-4 text-slate-400 hover:text-slate-300 text-sm underline">
                Ver todas
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={() => openEdit(movie)}
                onDelete={() => handleDelete(movie.id)}
                onMarkWatched={() => handleMarkWatched(movie)}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <MovieModal
          movie={editingMovie}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingMovie(null) }}
        />
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color = 'text-white' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
