import { getPosterGradient } from '../App.jsx'

function formatDateShort(ts) {
  if (!ts) return ''
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

export default function MovieCard({ movie, onEdit, onDelete, onMarkWatched }) {
  const watched = movie.status === 'vista'
  const rating = movie.ratingElla ?? movie.rating ?? 0

  return (
    <div
      className="group relative bg-surface-container rounded-2xl overflow-hidden transition-all duration-300 border border-white/5 cursor-pointer hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_0_30px_rgba(208,188,255,0.15)]"
      onClick={onEdit}
    >
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden relative">
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-3"
            style={{ background: getPosterGradient(movie.title) }}
          >
            <span className="text-white/10 font-bold leading-none select-none" style={{ fontSize: '72px', fontFamily: 'Montserrat' }}>
              {movie.title.charAt(0).toUpperCase()}
            </span>
            <span className="material-symbols-outlined text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontSize: '64px' }}>movie</span>
          </div>
        )}

        {/* Location badge */}
        <div className="absolute top-3 left-3 bg-surface/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
            {movie.location === 'cine' ? 'confirmation_number' : 'weekend'}
          </span>
        </div>

        {/* Pending badge */}
        {!watched && (
          <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-md rounded-lg border border-white/10 px-1.5 py-0.5">
            <span className="font-label-caps text-label-caps text-on-surface-variant" style={{ fontSize: '10px' }}>
              PENDIENTE
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3">
          {!watched && (
            <button
              onClick={e => { e.stopPropagation(); onMarkWatched() }}
              className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-caps text-label-caps hover:bg-primary/90 transition-colors w-full text-center"
            >
              ✓ Ya la vimos
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="text-secondary/60 hover:text-secondary font-label-caps text-label-caps text-[10px] transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="p-3 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-title-md text-title-md text-on-surface leading-tight line-clamp-1 flex-1">
            {movie.title}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-0.5 text-secondary shrink-0">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1, 'wght' 200" }}
              >
                favorite
              </span>
              <span className="font-label-caps text-label-caps">{rating}.0</span>
            </div>
          )}
        </div>
        {watched && movie.watchedAt && (
          <p className="font-label-caps text-label-caps text-on-surface-variant">
            {formatDateShort(movie.watchedAt)}
          </p>
        )}
        {!watched && movie.plannedDate && (
          <p className="font-label-caps text-label-caps text-primary/60">
            {new Date(movie.plannedDate + 'T12:00:00').toLocaleDateString('es-ES', {
              day: 'numeric', month: 'short',
            })}
          </p>
        )}
      </div>
    </div>
  )
}
