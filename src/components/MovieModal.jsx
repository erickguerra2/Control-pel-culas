import { useState, useEffect } from 'react'

const BLANK = {
  title: '',
  imageUrl: '',
  location: 'cine',
  status: 'pendiente',
  plannedDate: '',
  ratingElla: 0,
  ratingEl: 0,
  notes: '',
}

function tsToDateInput(ts) {
  if (!ts) return ''
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toISOString().split('T')[0]
}

function HeartRating({ rating, onChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === rating ? 0 : n)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '28px',
              color: n <= rating ? '#ffb2b7' : 'rgba(203,195,215,0.25)',
              fontVariationSettings: n <= rating ? "'FILL' 1, 'wght' 200" : "'FILL' 0, 'wght' 200",
            }}
          >
            favorite
          </span>
        </button>
      ))}
    </div>
  )
}

export default function MovieModal({ movie, onSave, onClose }) {
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title ?? '',
        imageUrl: movie.imageUrl ?? '',
        location: movie.location ?? 'cine',
        status: movie.status ?? 'pendiente',
        plannedDate: movie.plannedDate || tsToDateInput(movie.watchedAt) || '',
        ratingElla: movie.ratingElla ?? movie.rating ?? 0,
        ratingEl: movie.ratingEl ?? 0,
        notes: movie.notes ?? '',
      })
    }
  }, [movie])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const data = {
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
        location: form.location,
        status: form.status,
        notes: form.notes.trim(),
        ratingElla: form.status === 'vista' ? form.ratingElla : 0,
        ratingEl: form.status === 'vista' ? form.ratingEl : 0,
        plannedDate: form.plannedDate,
      }
      if (form.status === 'vista' && form.plannedDate && !movie?.watchedAt) {
        data.watchedAt = new Date(form.plannedDate + 'T12:00:00').getTime()
      }
      await onSave(data)
    } finally {
      setSaving(false)
    }
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdrop}
    >
      {/* Ambient glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[680px] glass-panel rounded-3xl p-6 md:p-10 shadow-2xl my-4 relative">
        <div className="mb-8 text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            {movie ? 'Editar Recuerdo' : 'Nuevo Recuerdo Cinematográfico'}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Inmortaliza el momento y comparte tu opinión.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Field label="TÍTULO DE LA PELÍCULA">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '20px' }}>search</span>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Busca una película..."
                autoFocus
                className="w-full bg-surface-container-lowest/60 border border-white/10 focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 focus:outline-none transition-colors"
              />
            </div>
          </Field>

          {/* Image URL */}
          <Field label="URL DEL PÓSTER" hint="opcional">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '20px' }}>image</span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-surface-container-lowest/60 border border-white/10 focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 focus:outline-none transition-colors"
              />
            </div>
          </Field>

          {/* Date + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={form.status === 'vista' ? 'FECHA DE LA CITA' : 'FECHA PLANEADA'} hint="opcional">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '20px' }}>calendar_today</span>
                <input
                  type="date"
                  value={form.plannedDate}
                  onChange={e => set('plannedDate', e.target.value)}
                  className="w-full bg-surface-container-lowest/60 border border-white/10 focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md text-body-md focus:outline-none transition-colors"
                />
              </div>
            </Field>

            <Field label="UBICACIÓN">
              <div className="flex p-1 bg-surface-container-lowest/60 border border-white/10 rounded-xl h-[54px]">
                {[
                  { val: 'cine', icon: 'confirmation_number', label: 'Cine' },
                  { val: 'casa', icon: 'home', label: 'Casa' },
                ].map(({ val, icon, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set('location', val)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-body-md text-body-md font-medium transition-all ${
                      form.location === val
                        ? 'bg-primary/20 text-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Status */}
          <Field label="ESTADO">
            <div className="flex p-1 bg-surface-container-lowest/60 border border-white/10 rounded-xl">
              {[
                { val: 'pendiente', icon: 'schedule', label: 'Pendiente' },
                { val: 'vista', icon: 'check_circle', label: 'Ya la vimos' },
              ].map(({ val, icon, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('status', val)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg font-body-md text-body-md font-medium transition-all ${
                    form.status === val
                      ? 'bg-primary/20 text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Dual Rating */}
          {form.status === 'vista' && (
            <Field label="NUESTRA CALIFICACIÓN">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-2xl p-5 bg-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>person</span>
                    </div>
                    <span className="font-title-md text-title-md text-on-surface">Ella</span>
                  </div>
                  <HeartRating rating={form.ratingElla} onChange={v => set('ratingElla', v)} />
                </div>
                <div className="glass-panel rounded-2xl p-5 bg-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>person</span>
                    </div>
                    <span className="font-title-md text-title-md text-on-surface">Él</span>
                  </div>
                  <HeartRating rating={form.ratingEl} onChange={v => set('ratingEl', v)} />
                </div>
              </div>
            </Field>
          )}

          {/* Notes */}
          <Field label="NOTAS Y PENSAMIENTOS" hint="opcional">
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="¿Qué os ha parecido? ¿Alguna anécdota especial?"
              rows={4}
              className="w-full bg-surface-container-lowest/60 border border-white/10 focus:border-primary rounded-xl py-4 px-4 text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 focus:outline-none transition-colors resize-none custom-scrollbar"
            />
          </Field>

          {/* Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="w-full py-4 bg-gradient-to-r from-inverse-primary to-primary-container text-white font-bold font-body-lg text-body-lg rounded-xl shadow-[0_4px_20px_rgba(109,59,215,0.4)] hover:shadow-[0_4px_30px_rgba(109,59,215,0.6)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Guardando...' : movie ? 'Guardar Cambios' : 'Guardar Recuerdo'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 font-body-md text-body-md text-on-surface-variant hover:text-on-surface font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <label className="font-label-caps text-label-caps text-on-surface-variant block ml-1">
        {label}
        {hint && <span className="normal-case font-normal text-on-surface-variant/50 ml-1">· {hint}</span>}
      </label>
      {children}
    </div>
  )
}
