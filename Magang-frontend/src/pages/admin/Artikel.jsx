import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function Artikel() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    id_kategori_artikel: '',
    judul: '',
    konten: '',
    status: 'draft',
    foto_sampul_file: null
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/artikel', { params: { page, search } })
      setArticles(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchArticles()
    api.get('/admin/kategori-artikel?all=1').then(res => setCategories(res.data))
  }, [fetchArticles])

  const openCreate = () => {
    setEditId(null)
    setForm({
      id_kategori_artikel: categories[0]?.id_kategori_artikel || '',
      judul: '',
      konten: '',
      status: 'draft',
      foto_sampul_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (art) => {
    setEditId(art.id_artikel)
    setForm({
      id_kategori_artikel: art.id_kategori_artikel,
      judul: art.judul,
      konten: art.konten,
      status: art.status,
      foto_sampul_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, foto_sampul_file: e.target.files[0] })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('id_kategori_artikel', form.id_kategori_artikel)
      formData.append('judul', form.judul)
      formData.append('konten', form.konten)
      formData.append('status', form.status)
      if (form.foto_sampul_file) {
        formData.append('foto_sampul', form.foto_sampul_file)
      }

      if (editId) {
        formData.append('_method', 'PUT')
        await api.post(`/admin/artikel/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToast('Artikel berhasil diperbarui!')
      } else {
        await api.post('/admin/artikel', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToast('Artikel berhasil ditambahkan!')
      }
      setShowModal(false)
      fetchArticles()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        showToast('Gagal menyimpan artikel. Periksa isian Anda!', 'error')
      } else {
        console.error(err)
        showToast(err.response?.data?.message || 'Terjadi kesalahan sistem!', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return
    try {
      await api.delete(`/admin/artikel/${id}`)
      showToast('Artikel berhasil dihapus!')
      fetchArticles()
    } catch (err) {
      console.error(err)
      showToast('Gagal menghapus artikel!', 'error')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Artikel</h1>
          <p className="text-base-content/60 text-sm">Kelola semua artikel blog</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Artikel</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} artikel</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Foto</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th className="w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  articles.map((art, i) => (
                    <tr key={art.id_artikel} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td>
                        <div className="w-12 h-8 rounded bg-base-200 overflow-hidden">
                          {art.foto_sampul ? (
                            <img src={`http://localhost:8000/storage/${art.foto_sampul}`} alt={art.judul} className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-[10px] text-base-content/30 flex items-center justify-center h-full">No pic</span>
                          )}
                        </div>
                      </td>
                      <td><span className="font-semibold text-secondary line-clamp-1">{art.judul}</span></td>
                      <td>
                        <span className="badge badge-sm bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-3 py-1 font-bold whitespace-nowrap uppercase">
                          {art.kategori?.nama_kategori}
                        </span>
                      </td>
                      <td><span className="text-xs">{art.penulis?.name}</span></td>
                      <td>
                        <span className={`badge badge-xs ${art.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                          {art.status}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/50">
                        {art.dipublikasikan_pada ? new Date(art.dipublikasikan_pada).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(art)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(art.id_artikel)} 
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
          <div className="modal-box rounded-3xl max-w-lg">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit' : 'Tambah'} Artikel</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Kategori</span></label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={form.id_kategori_artikel}
                  onChange={(e) => setForm({ ...form, id_kategori_artikel: e.target.value })}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id_kategori_artikel} value={cat.id_kategori_artikel}>
                      {cat.nama_kategori}
                    </option>
                  ))}
                </select>
                {errors.id_kategori_artikel && <span className="text-error text-xs mt-1">{errors.id_kategori_artikel[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Judul</span></label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                />
                {errors.judul && <span className="text-error text-xs mt-1">{errors.judul[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Konten</span></label>
                <textarea
                  className="textarea textarea-bordered h-40 w-full"
                  value={form.konten}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })}
                  required
                ></textarea>
                {errors.konten && <span className="text-error text-xs mt-1">{errors.konten[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Foto Sampul</span></label>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {errors.foto_sampul && <span className="text-error text-xs mt-1">{errors.foto_sampul[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Status</span></label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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

      {toast.show && (
        <div className="toast toast-end toast-bottom z-[9999] p-4">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} text-white shadow-xl rounded-2xl flex items-center gap-2 border-none`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}