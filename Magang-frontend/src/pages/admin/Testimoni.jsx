import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/useAuth'

export default function Testimoni() {
  const { user } = useAuth()
  const isCustomer = user?.roles?.some(role => role.name === 'customer')

  const [testimonials, setTestimonials] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  // States for Customer Eligibility
  const [eligibility, setEligibility] = useState({ eligible: false, submitted: false })
  const [checkingEligibility, setCheckingEligibility] = useState(isCustomer)

  const [form, setForm] = useState({
    nama_klien: user?.name || '',
    jabatan: '',
    isi_testimoni: '',
    rating: 5,
    status: 'pending',
    foto_file: null
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const checkEligibility = useCallback(async () => {
    if (!isCustomer) return
    try {
      const res = await api.get('/testimoni/check')
      setEligibility(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setCheckingEligibility(false)
    }
  }, [isCustomer])

  const fetchTestimonials = useCallback(async () => {
    if (isCustomer) return
    setLoading(true)
    try {
      const res = await api.get('/admin/testimoni', { params: { page, search } })
      setTestimonials(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, isCustomer])

  useEffect(() => {
    if (isCustomer) {
      checkEligibility()
    } else {
      fetchTestimonials()
    }
  }, [fetchTestimonials, checkEligibility, isCustomer])

  const openCreate = () => {
    setEditId(null)
    setForm({
      nama_klien: user?.name || '',
      jabatan: '',
      isi_testimoni: '',
      rating: 5,
      status: 'pending',
      foto_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (t) => {
    setEditId(t.id_testimoni)
    setForm({
      nama_klien: t.nama_klien,
      jabatan: t.jabatan || '',
      isi_testimoni: t.isi_testimoni,
      rating: t.rating,
      status: t.status,
      foto_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, foto_file: e.target.files[0] })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('nama_klien', form.nama_klien)
      formData.append('jabatan', form.jabatan)
      formData.append('isi_testimoni', form.isi_testimoni)
      formData.append('rating', form.rating)
      if (form.foto_file) {
        formData.append('foto', form.foto_file)
      }

      if (isCustomer) {
        await api.post('/testimoni/submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        checkEligibility()
      } else {
        formData.append('status', form.status)
        if (editId) {
          formData.append('_method', 'PUT')
          await api.post(`/admin/testimoni/${editId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          await api.post('/admin/testimoni', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
        fetchTestimonials()
      }
      setShowModal(false)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/testimoni/${id}/status`, { status: newStatus })
      fetchTestimonials()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return
    try {
      await api.delete(`/admin/testimoni/${id}`)
      fetchTestimonials()
    } catch (err) {
      console.error(err)
    }
  }

  const handleApproveAll = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menyetujui semua testimoni yang pending?')) return
    try {
      await api.post('/testimoni/approve-all')
      fetchTestimonials()
    } catch (err) {
      console.error(err)
    }
  }

  // POV: Customer
  if (isCustomer) {
    if (checkingEligibility) {
      return (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )
    }

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Penilaian & Testimoni</h1>
          <p className="text-base-content/60 text-sm">Berikan penilaian Anda terhadap layanan Kurva Growth Technology</p>
        </div>

        {!eligibility.eligible ? (
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-full mx-auto text-2xl">
              🔒
            </div>
            <h2 className="text-lg font-bold text-secondary">Fitur Terkunci</h2>
            <p className="text-xs text-base-content/60 leading-relaxed max-w-sm mx-auto">
              Anda harus melakukan pembelian produk Kurva minimal 1 kali (tahapan proyek selesai atau masuk masa maintenance) untuk dapat memberikan testimoni.
            </p>
          </div>
        ) : eligibility.submitted ? (
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 bg-success/10 text-success flex items-center justify-center rounded-full mx-auto text-2xl">
              ✓
            </div>
            <h2 className="text-lg font-bold text-secondary">Terima Kasih!</h2>
            <p className="text-xs text-base-content/60 leading-relaxed max-w-sm mx-auto">
              Penilaian Anda telah kami terima dan sedang ditinjau oleh tim kami sebelum ditampilkan di profil perusahaan.
            </p>
          </div>
        ) : (
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-secondary mb-4">Formulir Testimoni</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs">Nama Lengkap</span></label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  className="input input-bordered input-sm w-full rounded-xl"
                  value={form.nama_klien}
                  onChange={(e) => setForm({ ...form, nama_klien: e.target.value })}
                  required
                />
                {errors.nama_klien && <span className="text-error text-xs mt-1">{errors.nama_klien[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs">Jabatan / Instansi</span></label>
                <input
                  type="text"
                  placeholder="Contoh: CEO PT Sukses Bersama"
                  className="input input-bordered input-sm w-full rounded-xl"
                  value={form.jabatan}
                  onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                />
                {errors.jabatan && <span className="text-error text-xs mt-1">{errors.jabatan[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs">Isi Testimoni</span></label>
                <textarea
                  className="textarea textarea-bordered h-28 w-full rounded-xl"
                  placeholder="Ceritakan pengalaman Anda bekerja sama dengan kami..."
                  value={form.isi_testimoni}
                  onChange={(e) => setForm({ ...form, isi_testimoni: e.target.value })}
                  required
                ></textarea>
                {errors.isi_testimoni && <span className="text-error text-xs mt-1">{errors.isi_testimoni[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs">Rating</span></label>
                <div className="rating rating-md">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name="rating-star"
                      className="mask mask-star-2 bg-amber-400"
                      checked={form.rating === star}
                      onChange={() => setForm({ ...form, rating: star })}
                    />
                  ))}
                </div>
                {errors.rating && <span className="text-error text-xs mt-1">{errors.rating[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs">Foto Profil (Opsional)</span></label>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full rounded-xl"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {errors.foto && <span className="text-error text-xs mt-1">{errors.foto[0]}</span>}
              </div>

              <div className="pt-2">
                <button type="submit" className="btn btn-primary btn-sm text-white w-full rounded-xl" disabled={saving}>
                  {saving && <span className="loading loading-spinner loading-xs"></span>}
                  Kirim Penilaian
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }

  // POV: Admin / Marketing (Lanjut ke tampilan manage list seperti biasa)

  // POV: Admin / Marketing (Lanjut ke tampilan manage list seperti biasa)
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Testimoni</h1>
          <p className="text-base-content/60 text-sm">Kelola testimoni dari klien. Hanya testimoni berstatus "approved" yang akan ditampilkan di profil perusahaan.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleApproveAll} 
            className="btn btn-secondary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90 bg-emerald-600 hover:bg-emerald-700"
          >
            <span>Setujui Semua</span>
          </button>
          <button 
            onClick={openCreate} 
            className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Testimoni</span>
          </button>
        </div>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari testimoni..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} testimoni</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Foto</th>
                  <th>Klien</th>
                  <th>Jabatan</th>
                  <th>Testimoni</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="w-48">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : testimonials.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  testimonials.map((t, i) => (
                    <tr key={t.id_testimoni} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td>
                        <div className="w-8 h-8 rounded-full bg-base-200 overflow-hidden flex items-center justify-center">
                          {t.foto ? (
                            <img src={`http://localhost:8000/storage/${t.foto}`} alt={t.nama_klien} className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{t.nama_klien.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                      </td>
                      <td><span className="font-semibold text-secondary">{t.nama_klien}</span></td>
                      <td><span className="text-xs">{t.jabatan || '-'}</span></td>
                      <td className="max-w-xs"><p className="text-xs line-clamp-2">{t.isi_testimoni}</p></td>
                      <td>
                        <div className="flex text-amber-400">
                          {[...Array(t.rating)].map((_, idx) => (
                            <span key={idx}>★</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-xs ${t.status === 'approved' ? 'badge-success' : t.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          {t.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusChange(t.id_testimoni, 'approved')} className="btn btn-success btn-xs">
                                Setujui
                              </button>
                              <button onClick={() => handleStatusChange(t.id_testimoni, 'rejected')} className="btn btn-error btn-xs">
                                Tolak
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => openEdit(t)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(t.id_testimoni)} 
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30 border border-rose-200/50 dark:border-rose-900/50 transition-all duration-200 hover:scale-105"
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta.last_page > 1 && (
            <div className="flex justify-center mt-4">
              <div className="join">
                <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>«</button>
                <button className="join-item btn btn-sm btn-disabled">Hal {meta.current_page}/{meta.last_page}</button>
                <button className="join-item btn btn-sm" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-3xl">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit' : 'Tambah'} Testimoni</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Nama Klien</span></label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={form.nama_klien}
                  onChange={(e) => setForm({ ...form, nama_klien: e.target.value })}
                  required
                />
                {errors.nama_klien && <span className="text-error text-xs mt-1">{errors.nama_klien[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Jabatan</span></label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={form.jabatan}
                  onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                />
                {errors.jabatan && <span className="text-error text-xs mt-1">{errors.jabatan[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Isi Testimoni</span></label>
                <textarea
                  className="textarea textarea-bordered h-28 w-full"
                  value={form.isi_testimoni}
                  onChange={(e) => setForm({ ...form, isi_testimoni: e.target.value })}
                  required
                ></textarea>
                {errors.isi_testimoni && <span className="text-error text-xs mt-1">{errors.isi_testimoni[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Rating</span></label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  required
                >
                  <option value="5">5 Bintang</option>
                  <option value="4">4 Bintang</option>
                  <option value="3">3 Bintang</option>
                  <option value="2">2 Bintang</option>
                  <option value="1">1 Bintang</option>
                </select>
                {errors.rating && <span className="text-error text-xs mt-1">{errors.rating[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Foto</span></label>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {errors.foto && <span className="text-error text-xs mt-1">{errors.foto[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Status</span></label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                {errors.status && <span className="text-error text-xs mt-1">{errors.status[0]}</span>}
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm text-white" disabled={saving}>
                  {saving && <span className="loading loading-spinner loading-xs"></span>}
                  {editId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop"><button type="button" onClick={() => setShowModal(false)}>close</button></form>
        </dialog>
      )}
    </div>
  )
}