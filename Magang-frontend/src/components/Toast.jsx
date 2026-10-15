import { useEffect } from 'react'

const config = {
  success: {
    gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
    ring: 'ring-emerald-300/50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Berhasil',
  },
  error: {
    gradient: 'from-red-500 via-red-600 to-red-700',
    ring: 'ring-red-300/50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Gagal',
  },
  warning: {
    gradient: 'from-amber-400 via-amber-500 to-amber-600',
    ring: 'ring-amber-300/50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    label: 'Perhatian',
  },
}

export default function Toast({ show, type = 'success', message, onClose }) {
  useEffect(() => {
    if (show && onClose) {
      const t = setTimeout(onClose, 4000)
      return () => clearTimeout(t)
    }
  }, [show, onClose])

  if (!show || !message) return null

  const c = config[type] || config.success

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-[slideInRight_0.3s_ease]">
      <div className={`flex items-start gap-3 bg-gradient-to-r ${c.gradient} text-white rounded-2xl shadow-2xl shadow-black/25 ring-1 ${c.ring} px-5 py-4 max-w-md min-w-[280px]`}>
        <div className="mt-0.5 bg-white/20 rounded-full p-1.5 flex-shrink-0">
          {c.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white/80 leading-none mb-1">{c.label}</p>
          <p className="text-sm font-semibold leading-snug break-words text-white">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0 mt-0.5" aria-label="Tutup">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
