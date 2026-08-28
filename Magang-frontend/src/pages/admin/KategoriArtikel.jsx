import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function KategoriArtikel() {
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ nama_kategori: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/kategori-artikel', { params: { page, search } })
      setCategories(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const openCreate = () => {
    setEditId(null)
    setForm({ nama_kategori: '' })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditId(cat.id_kategori_artikel)
    setForm({ nama_kategori: cat.nama_kategori })
    setErrors({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/admin/kategori-artikel/${editId}`, form)
        showToast('Kategori blog berhasil diperbarui!')
      } else {
        await api.post('/admin/kategori-artikel', form)
        showToast('Kategori blog berhasil ditambahkan!')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        showToast('Gagal menyimpan kategori. Periksa inputan Anda!', 'error')
      } else {
        console.error(err)
        showToast('Terjadi kesalahan pada server!', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus kategori blog ini?')) return
    try {
      await api.delete(`/admin/kategori-artikel/${id}`)
      showToast('Kategori blog berhasil dihapus!')
      fetchCategories()
    } catch (err) {
      console.error(err)
      showToast('Gagal menghapus kategori!', 'error')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Kategori Blog</h1>
          <p className="text-base-content/60 text-sm">Kelola kategori artikel blog</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari kategori..."
                className="input input-bordered rounded-xl input-sm w-full max-w-xs pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <span className="text-sm text-base-content/60 font-medium">{meta.total || 0} kategori</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50 text-[11px] uppercase tracking-wider text-base-content/50">
                  <th className="w-12">#</th>
                  <th>Nama Kategori</th>
                  <th className="w-28 text-right pr-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-base-content/50 font-medium">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, i) => (
                    <tr key={cat.id_kategori_artikel} className="hover:bg-base-200/40 transition-colors">
                      <td className="text-base-content/50 font-mono text-xs">
                        {(meta.current_page - 1) * meta.per_page + i + 1}
                      </td>
                      <td>
                        <span className="font-bold text-secondary text-sm">{cat.nama_kategori}</span>
                      </td>
                      <td className="text-right pr-4">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openEdit(cat)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id_kategori_artikel)} 
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

          {/* Pagination */}
          {!loading && meta.last_page > 1 && (
            <div className="flex justify-center gap-1 mt-6">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-xs rounded-lg"
              >
                Sebelumnya
              </button>
              {[...Array(meta.last_page)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`btn btn-xs rounded-lg ${page === i + 1 ? 'btn-primary text-white border-none' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={page === meta.last_page}
                onClick={() => setPage(page + 1)}
                className="btn btn-xs rounded-lg"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal CRUD */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box rounded-3xl max-w-lg">
            <h3 className="font-bold text-lg text-secondary mb-4">
              {editId ? 'Edit' : 'Tambah'} Kategori Blog
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nama Kategori Blog</span>
                </label>
                <input
                  type="text"
                  required
                  className="input input-bordered rounded-xl w-full"
                  value={form.nama_kategori}
                  onChange={(e) => setForm({ nama_kategori: e.target.value })}
                  placeholder="Contoh: Software Engineering, Tips & Panduan, Berita"
                  autoFocus
                />
                {errors.nama_kategori && (
                  <span className="text-error text-xs mt-1">{errors.nama_kategori[0]}</span>
                )}
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn btn-sm rounded-xl btn-ghost font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="btn btn-sm btn-primary rounded-xl text-white border-none px-5 font-semibold"
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : editId ? (
                    'Perbarui'
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setShowModal(false)}>close</button>
          </form>
        </div>
      )}

      {/* Toast Alert */}
      {toast.show && (
        <div className="toast toast-end toast-bottom z-[9999] p-4">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} text-white shadow-xl rounded-2xl flex items-center gap-2 border-none`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}