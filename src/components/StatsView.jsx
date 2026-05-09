import { getPosterGradient } from '../App.jsx'

function formatDateShort(ts) {
  if (!ts) return ''
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

function avg(movies, key) {
  const rated = movies.filter(m => (m[key] ?? 0) > 0)
  if (!rated.length) return null
  return (rated.reduce((s, m) => s + (m[key] ?? 0), 0) / rated.length).toFixed(1)
}

export default function StatsView({ movies }) {
  const watched = movies.filter(m => m.status === 'vista')
  const pending = movies.filter(m => m.status === 'pendiente')
  const cine = movies.filter(m => m.location === 'cine')
  const casa = movies.filter(m => m.location === 'casa')

  const avgElla = avg(watched, 'ratingElla') ?? avg(watched, 'rating')
  const avgEl = avg(watched, 'ratingEl')

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8 pb-8 space-y-stack-lg">
      <div>
        <h1 className="font-display-md text-display-md text-on-surface mb-1">Couple Stats</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Vuestro viaje cinematográfico en números.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Main count */}
        <div
          className="md:col-span-8 glass-panel rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
          style={{ boxShadow: '0 0 30px rgba(208,188,255,0.12)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Vuestro Cineclub</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Películas juntos</h2>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-bold text-primary leading-none" style={{ fontSize: '80px' }}>{movies.length}</span>
            <div className="text-on-surface-variant font-body-md text-body-md space-y-0.5">
              <p>{watched.length} vistas</p>
              <p>{pending.length} pendientes</p>
            </div>
          </div>
        </div>

        {/* Cinema vs home */}
        <div
          className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col justify-center items-center text-center"
          style={{ boxShadow: '0 0 25px rgba(255,178,183,0.1)' }}
        >
          <div className="bg-secondary/20 p-4 rounded-full mb-3">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: '40px' }}>theaters</span>
          </div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">En el cine</h3>
          <p className="font-bold text-on-surface leading-tight" style={{ fontSize: '36px' }}>{cine.length}</p>
          <p className="font-body-md text-body-md text-on-surface-variant">{casa.length} en casa</p>
        </div>

        {/* Ratings */}
        <div className="md:col-span-5 glass-panel rounded-xl p-6 flex flex-col">
          <h3 className="font-title-md text-title-md text-on-surface mb-5">Calificaciones promedio</h3>
          <div className="space-y-5 flex-1">
            {[
              { label: 'Ella', key: 'ratingElla', color: 'primary', value: avgElla },
              { label: 'Él', key: 'ratingEl', color: 'secondary', value: avgEl },
            ].map(({ label, color, value }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-${color}/20 border border-${color}/30`}>
                    <span className={`material-symbols-outlined text-${color}`} style={{ fontSize: '14px' }}>person</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">{label}</span>
                </div>
                <div className="flex items-center gap-1 text-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1, 'wght' 200" }}>favorite</span>
                  <span className="font-title-md text-title-md">{value ?? '—'}</span>
                </div>
              </div>
            ))}
          </div>
          {watched.length === 0 && (
            <p className="font-body-md text-body-md text-on-surface-variant text-center py-4">
              Aún no habéis visto ninguna película.
            </p>
          )}
        </div>

        {/* Recent movies */}
        <div className="md:col-span-7 glass-panel rounded-xl p-6">
          <h3 className="font-title-md text-title-md text-on-surface mb-4">Últimas vistas</h3>
          <div className="space-y-3">
            {watched.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-12 rounded-lg overflow-hidden shrink-0"
                    style={{ background: getPosterGradient(m.title) }}
                  >
                    {m.imageUrl && (
                      <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body-md text-body-md text-on-surface truncate">{m.title}</p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">
                      {formatDateShort(m.watchedAt)}
                    </p>
                  </div>
                </div>
                {(m.ratingElla ?? m.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-0.5 text-secondary shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1, 'wght' 200" }}>favorite</span>
                    <span className="font-label-caps text-label-caps">{m.ratingElla ?? m.rating}</span>
                  </div>
                )}
              </div>
            ))}
            {watched.length === 0 && (
              <p className="font-body-md text-body-md text-on-surface-variant text-center py-6">
                Marcad películas como vistas para verlas aquí.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
