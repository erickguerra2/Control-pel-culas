function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`text-lg ${n <= rating ? 'text-yellow-400' : 'text-slate-700'}`}>
          ★
        </span>
      ))}
    </div>
  )
}

function formatDate(ts) {
  if (!ts) return null
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MovieCard({ movie, onEdit, onDelete, onMarkWatched }) {
  const watched = movie.status === 'vista'

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col gap-3 transition-colors">
      <div className="flex items-start gap-2">
        <h3 className="font-semibold text-white leading-snug flex-1 min-w-0">{movie.title}</h3>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            movie.location === 'cine'
              ? 'bg-sky-950/60 text-sky-300 border-sky-800/60'
              : 'bg-violet-950/60 text-violet-300 border-violet-800/60'
          }`}>
            {movie.location === 'cine' ? '🎬 Cine' : '🏠 Casa'}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            watched
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
          }`}>
            {watched ? '✅ Vista' : '🕐 Pendiente'}
          </span>
        </div>
      </div>

      {watched && movie.rating > 0 && <Stars rating={movie.rating} />}

      {movie.notes && (
        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{movie.notes}</p>
      )}

      {watched && movie.watchedAt && (
        <p className="text-xs text-slate-500">Vista el {formatDate(movie.watchedAt)}</p>
      )}

      {!watched && movie.plannedDate && (
        <p className="text-xs text-slate-500">
          Planeada para {new Date(movie.plannedDate + 'T12:00:00').toLocaleDateString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-800/80">
        {!watched && (
          <button
            onClick={onMarkWatched}
            className="flex-1 text-xs bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            ✓ Marcar vista
          </button>
        )}
        <button
          onClick={onEdit}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          title="Eliminar"
          className="text-xs bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800/60 text-slate-400 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
