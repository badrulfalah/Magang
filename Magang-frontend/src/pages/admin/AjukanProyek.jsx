import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AjukanProyek({ isOpen, onClose, onSaved }) {
  const [layananId, setLayananId] = useState('')
  const [namaProyek, setNamaProyek] = useState('')
  const [deskripsiKebutuhan, setDeskripsiKebutuhan] = useState('')
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isOpen) return

    // Reset form states when opened
    setNamaProyek('')
    setLayananId('')
    setDeskripsiKebutuhan('')
    setErrorMsg('')

    // Ambil profile pengguna
    api.get('/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))

    // Ambil daftar layanan untuk dropdown
    api.get('/public/layanan')
      .then(res => {
        const allServices = []
        if (res.data && Array.isArray(res.data)) {
          res.data.forEach(category => {
            if (category.layanan && Array.isArray(category.layanan)) {
              category.layanan.forEach(item => {
                allServices.push({
                  id_layanan: item.id_layanan,
                  title: item.title
                })
              })
            }
          })
        }
        setServices(allServices)
      })
      .catch(err => console.error(err))
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!layananId || !namaProyek.trim() || !deskripsiKebutuhan.trim()) {
      setErrorMsg('Harap lengkapi semua kolom yang diperlukan.')
      return
    }

    setLoading(true)
    try {
      await api.post('/proyek', {
        layanan_id: layananId,
        nama_proyek: namaProyek,
        deskripsi_kebutuhan: deskripsiKebutuhan
      })
      if (onSaved) onSaved()
    } catch (err) {
      console.error(err)
      setErrorMsg(err.response?.data?.message || 'Gagal mengirimkan pengajuan proyek. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box rounded-3xl max-w-xl p-6 sm:p-7 border border-base-200 shadow-2xl space-y-5 relative">
        {/* Close button in top-right */}
        <button 
          type="button"
          onClick={onClose} 
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/50 hover:text-base-content"
          title="Tutup"
        >
          ✕
        </button>

        {/* Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            Proyek Baru
          </span>
          <h2 className="text-xl font-extrabold text-secondary mt-1.5">
            Ajukan Proyek Digital
          </h2>
          <p className="text-xs text-base-content/60 mt-0.5">
            Kirimkan rincian kebutuhan sistem Anda dan mulai konsultasi dengan tim ahli kami.
          </p>
        </div>

        {/* Profile snippet */}
        {profile && (
          <div className="p-3 bg-base-50 border border-base-200/80 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
              {profile.avatar ? (
                <img src={`http://localhost:8000/storage/${profile.avatar}`} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-secondary truncate">{profile.name}</p>
              <p className="text-[10px] text-base-content/50 truncate mt-0.5">{profile.email}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-error text-white text-xs py-2 px-3 rounded-xl">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label py-0.5">
              <span className="label-text text-[11px] font-bold text-secondary">
                Judul / Nama Proyek <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Website E-Commerce & Inventory System"
              className="input input-bordered border-primary/30 rounded-xl text-xs w-full focus:outline-none focus:border-primary focus:input-primary bg-white"
              style={{ border: '1px solid rgba(46, 150, 120, 0.3)' }}
              value={namaProyek}
              onChange={(e) => setNamaProyek(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-control">
            <label className="label py-0.5">
              <span className="label-text text-[11px] font-bold text-secondary">
                Pilih Kategori Layanan <span className="text-error">*</span>
              </span>
            </label>
            <select
              className="select select-bordered border-primary/30 rounded-xl text-xs w-full focus:outline-none focus:border-primary focus:select-primary bg-white"
              style={{ border: '1px solid rgba(46, 150, 120, 0.3)' }}
              value={layananId}
              onChange={(e) => setLayananId(e.target.value)}
              required
            >
              <option value="">Pilih salah satu layanan...</option>
              {services.map((item) => (
                <option key={item.id_layanan} value={item.id_layanan}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label py-0.5">
              <span className="label-text text-[11px] font-bold text-secondary">
                Deskripsi Kebutuhan Proyek <span className="text-error">*</span>
              </span>
            </label>
            <textarea
              placeholder="Jelaskan ringkasan kebutuhan, fitur utama yang diinginkan, target timeline, atau catatan khusus lainnya..."
              className="textarea textarea-bordered border-primary/30 rounded-xl text-xs h-28 leading-relaxed focus:outline-none focus:border-primary focus:textarea-primary bg-white"
              style={{ border: '1px solid rgba(46, 150, 120, 0.3)' }}
              value={deskripsiKebutuhan}
              onChange={(e) => setDeskripsiKebutuhan(e.target.value)}
              required
            />
          </div>

          <div className="modal-action pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm rounded-xl btn-ghost font-semibold text-xs px-4"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-sm btn-primary rounded-xl text-white font-semibold px-5 border-none shadow-sm gap-2 transition-all hover:opacity-90"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <span>Kirim Pengajuan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop bg-black/40">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </div>
  )
}
