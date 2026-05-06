import { useState, useEffect } from 'react'

const BLANK = {
  title: '',
  location: 'cine',
  status: 'pendiente',
  rating: 0,
  plannedDate: '',
  notes: '',
}

export default function MovieModal({ movie, onSave, onClose }) {
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title ?? '',
        location: movie.location ?? 'cine',
        status: movie.status ?? 'pendiente',
        rating: movie.rating ?? 0,
        plannedDate: movie.plannedDate ?? '',
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
        ...form,
        title: form.title.trim(),
        rating: form.status === 'vista' ? form.rating : 0,
        plannedDate: form.status === 'pendiente' ? form.plannedDate : '',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold">
            {movie ? 'Editar película' : 'Agregar película'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-1.5">
              Título
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Nombre de la película..."
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-1.5">
              ¿Dónde la van a ver?
            </label>
            <div className="flex gap-2">
              {[
                { val: 'cine', label: '🎬 Cine' },
                { val: 'casa', label: '🏠 Casa' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('location', val)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.location === val
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-1.5">
              Estado
            </label>
            <div className="flex gap-2">
              {[
                { val: 'pendiente', label: '🕐 Pendiente' },
                { val: 'vista', label: '✅ Ya la vimos' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('status', val)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.status === val
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {form.status === 'vista' && (
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide block mb-1.5">
                Calificación
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('rating', n === form.rating ? 0 : n)}
                    className={`text-2xl transition-colors leading-none ${
                      n <= form.rating
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    ★
                  </button>
                ))}
                {form.rating > 0 && (
                  <span className="ml-2 text-sm text-slate-400 self-center">{form.rating}/5</span>
                )}
              </div>
            </div>
          )}

          {form.status === 'pendiente' && (
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide block mb-1.5">
                Fecha planeada <span className="normal-case text-slate-500">(opcional)</span>
              </label>
              <input
                type="date"
                value={form.plannedDate}
                onChange={e => set('plannedDate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-1.5">
              Notas <span className="normal-case text-slate-500">(opcional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Comentarios, opiniones, quién la recomendó..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {saving ? 'Guardando...' : movie ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
