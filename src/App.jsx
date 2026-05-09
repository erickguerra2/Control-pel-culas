import { useState, useEffect } from 'react'
import { subscribeMovies, addMovie, updateMovie, deleteMovie, markWatched, firebaseEnabled } from './storage.js'
import MovieCard from './components/MovieCard.jsx'
import MovieModal from './components/MovieModal.jsx'
import StatsView from './components/StatsView.jsx'

const FILTERS = [
  { id: 'todos', label: 'TODOS' },
  { id: 'cine', label: 'CINE', icon: 'confirmation_number' },
  { id: 'casa', label: 'CASA', icon: 'weekend' },
  { id: 'pendientes', label: 'PENDIENTES', icon: 'schedule' },
]

export default function App() {
  const [movies, setMovies] = useState([])
  const [filter, setFilter] = useState('todos')
  const [view, setView] = useState('board')
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

  const featuredMovie = movies.find(m => m.status === 'vista')

  const filtered = movies.filter(m => {
    if (filter === 'todos') return true
    if (filter === 'cine') return m.location === 'cine'
    if (filter === 'casa') return m.location === 'casa'
    if (filter === 'pendientes') return m.status === 'pendiente'
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

  const openAdd = () => { setEditingMovie(null); setShowModal(true) }
  const openEdit = (movie) => { setEditingMovie(movie); setShowModal(true) }

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-8">
          <span className="font-headline-lg text-headline-lg font-bold tracking-tight text-gradient cursor-default select-none">
            CineJournal
          </span>
          <div className="hidden md:flex gap-6">
            <button
              onClick={() => setView('board')}
              className={`font-body-md text-body-md font-medium pb-0.5 transition-colors ${view === 'board' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Memory Board
            </button>
            <button
              onClick={() => setView('stats')}
              className={`font-body-md text-body-md font-medium pb-0.5 transition-colors ${view === 'stats' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Statistics
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!firebaseEnabled && (
            <span className="hidden md:block font-label-caps text-label-caps text-amber-400 bg-amber-900/30 border border-amber-700/30 px-2 py-1 rounded-full">
              Modo local
            </span>
          )}
          <button
            onClick={openAdd}
            className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-inverse-primary to-primary-container text-white font-body-md text-body-md font-medium px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:shadow-primary/30 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Agregar
          </button>
        </div>
      </nav>

      <main className="pt-20 pb-24 md:pb-8">
        {view === 'board' && (
          <>
            {!loading && (
              <HeroSection movie={featuredMovie} onAdd={openAdd} />
            )}

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
                  Cartelera de Recuerdos
                </h2>
                <div className="flex p-1 bg-surface-container-low rounded-full border border-white/5 w-fit overflow-x-auto">
                  {FILTERS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`flex items-center gap-1 px-3 md:px-5 py-2 rounded-full font-label-caps text-label-caps whitespace-nowrap transition-colors ${
                        filter === f.id
                          ? 'bg-primary/20 text-primary'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {f.icon && (
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{f.icon}</span>
                      )}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-24 text-on-surface-variant">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-body-md text-body-md">Cargando recuerdos...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-on-surface-variant">
                  <span className="material-symbols-outlined text-outline mb-4 block" style={{ fontSize: '64px' }}>movie_filter</span>
                  <p className="font-title-md text-title-md text-on-surface mb-2">
                    {filter === 'todos' ? 'Todavía no hay recuerdos' : 'No hay películas aquí'}
                  </p>
                  <p className="font-body-md text-body-md mb-6">
                    {filter === 'todos' ? '¡Agrega vuestra primera película juntos!' : 'Prueba otro filtro'}
                  </p>
                  {filter === 'todos' && (
                    <button
                      onClick={openAdd}
                      className="bg-gradient-to-r from-inverse-primary to-primary-container text-white px-6 py-3 rounded-full font-body-md text-body-md font-medium hover:scale-105 transition-transform"
                    >
                      Agregar película
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter pb-8">
                  {filtered.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onEdit={() => openEdit(movie)}
                      onDelete={() => handleDelete(movie.id)}
                      onMarkWatched={() => markWatched(movie.id)}
                    />
                  ))}
                </div>
              )}

              {!loading && filtered.length > 0 && (
                <div className="flex flex-col items-center py-8">
                  <div className="h-16 w-[2px] bg-gradient-to-b from-primary to-transparent relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(208,188,255,0.8)]" />
                  </div>
                  <p className="font-label-caps text-label-caps text-primary mt-3 tracking-widest">NUESTRO VIAJE CONTINÚA</p>
                </div>
              )}
            </section>
          </>
        )}

        {view === 'stats' && <StatsView movies={movies} />}
      </main>

      {/* Bottom Nav - mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface-container-low/40 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(109,59,215,0.15)] rounded-t-2xl">
        <NavBtn icon="grid_view" label="Board" active={view === 'board'} onClick={() => setView('board')} />
        <NavBtn icon="add_circle" label="Log" active={false} onClick={openAdd} highlight />
        <NavBtn icon="analytics" label="Stats" active={view === 'stats'} onClick={() => setView('stats')} />
      </nav>

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

function NavBtn({ icon, label, active, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
        active
          ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(208,188,255,0.3)]'
          : highlight
          ? 'text-secondary hover:text-secondary/80'
          : 'text-on-surface-variant/70 hover:text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-label-caps text-label-caps mt-0.5">{label}</span>
    </button>
  )
}

const POSTER_GRADIENTS = [
  'linear-gradient(145deg, #2d1b69, #1a0b3d, #0b1326)',
  'linear-gradient(145deg, #691b2d, #3d0b1a, #0b1326)',
  'linear-gradient(145deg, #1b3a69, #0b1a3d, #0b1326)',
  'linear-gradient(145deg, #1b692d, #0b3d1a, #0b1326)',
  'linear-gradient(145deg, #693d1b, #3d1b0b, #0b1326)',
  'linear-gradient(145deg, #4a1b69, #2a0b3d, #0b1326)',
]

export function getPosterGradient(title = '') {
  const hash = [...title].reduce((a, c) => a + c.charCodeAt(0), 0)
  return POSTER_GRADIENTS[hash % POSTER_GRADIENTS.length]
}

function formatDate(ts) {
  if (!ts) return null
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function HeroSection({ movie, onAdd }) {
  if (!movie) {
    return (
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8">
        <div
          className="relative rounded-3xl overflow-hidden min-h-[280px] flex items-center justify-center p-8 border border-white/10"
          style={{ background: 'linear-gradient(135deg, rgba(109,59,215,0.2) 0%, rgba(181,0,54,0.12) 100%)' }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/8 rounded-full blur-[80px]" />
          <div className="relative text-center">
            <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontSize: '64px' }}>theaters</span>
            <h1 className="font-display-md text-display-md text-on-surface mb-2">Bienvenidos a CineJournal</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">Vuestro diario cinematográfico de pareja</p>
            <button
              onClick={onAdd}
              className="bg-gradient-to-r from-inverse-primary to-primary-container text-white px-8 py-3 rounded-full font-title-md text-title-md hover:scale-105 transition-transform shadow-lg shadow-primary/20"
            >
              Agregar vuestra primera película
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8">
      <section className="relative rounded-3xl overflow-hidden min-h-[380px] md:min-h-[500px] flex items-end p-6 md:p-12 shadow-2xl">
        <div className="absolute inset-0 z-0">
          {movie.imageUrl ? (
            <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover scale-105" />
          ) : (
            <div className="w-full h-full" style={{ background: getPosterGradient(movie.title) }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 glass-panel rounded-2xl p-6 md:p-8 max-w-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-primary/20 text-primary font-label-caps text-label-caps px-3 py-1 rounded-full border border-primary/30">
              ÚLTIMO RECUERDO
            </span>
            {movie.ratingElla > 0 && (
              <div className="flex gap-0.5 ml-auto">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className={`material-symbols-outlined ${n <= movie.ratingElla ? 'text-secondary fill-icon' : 'text-outline'}`} style={{ fontSize: '16px', fontVariationSettings: n <= movie.ratingElla ? "'FILL' 1, 'wght' 200" : "'FILL' 0, 'wght' 200" }}>favorite</span>
                ))}
              </div>
            )}
          </div>
          <h1 className="font-display-md text-display-md text-on-surface mb-2 leading-tight">{movie.title}</h1>
          {movie.notes && (
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-5 line-clamp-2">{movie.notes}</p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`font-label-caps text-label-caps px-3 py-1 rounded-full border ${
              movie.location === 'cine'
                ? 'bg-primary/20 text-primary border-primary/30'
                : 'bg-secondary/20 text-secondary border-secondary/30'
            }`}>
              {movie.location === 'cine' ? '🎬 Cine' : '🏠 Casa'}
            </span>
            {movie.watchedAt && (
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span>
                <span className="font-body-md text-body-md">{formatDate(movie.watchedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
