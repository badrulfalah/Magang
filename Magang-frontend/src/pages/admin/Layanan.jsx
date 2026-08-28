import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function Layanan() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    id_kategori_layanan: '',
    num: '01',
    title: '',
    badge: '',
    desc: '',
    tag: ''
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

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/layanan', { params: { page, search } })
      setItems(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  const fetchAllCategories = async () => {
    try {
      const res = await api.get('/admin/kategori-layanan?all=1')
      setCategories(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchItems()
    fetchAllCategories()
  }, [fetchItems])

  const openCreate = () => {
    setEditId(null)
    setForm({
      id_kategori_layanan: categories.length > 0 ? categories[0].id_kategori_layanan : '',
      num: '01',
      title: '',
      badge: '',
      desc: '',
      tag: ''
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditId(item.id_layanan)
    setForm({
      id_kategori_layanan: item.id_kategori_layanan,
      num: item.num,
      title: item.title,
      badge: item.badge || '',
      desc: item.desc,
      tag: item.tag
    })
    setErrors({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/admin/layanan/${editId}`, form)
        showToast('Layanan berhasil diperbarui!')
      } else {
        await api.post('/admin/layanan', form)
        showToast('Layanan berhasil ditambahkan!')
      }
      setShowModal(false)
      fetchItems()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        showToast('Gagal menyimpan layanan. Periksa inputan Anda!', 'error')
      } else {
        console.error(err)
        showToast('Terjadi kesalahan pada server!', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus item layanan ini?')) return
    try {
      await api.delete(`/admin/layanan/${id}`)
      showToast('Layanan berhasil dihapus!')
      fetchItems()
    } catch (err) {
      console.error(err)
      showToast('Gagal menghapus layanan!', 'error')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Layanan Detail</h1>
          <p className="text-base-content/60 text-sm">Kelola butir-butir solusi dan layanan teknologi</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Layanan</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari layanan..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} item</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th className="w-16">No Urut</th>
                  <th>Kategori</th>
                  <th>Nama Layanan</th>
                  <th>Badge</th>
                  <th>Tag</th>
                  <th className="w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8"><span className="loading loading-spinner loading-md text-primary"></span></td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  items.map((item, i) => (
                    <tr key={item.id_layanan} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td><span className="font-bold text-xs text-primary">{item.num}</span></td>
                      <td>
                        <span className="badge badge-sm bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-3 py-1 font-bold whitespace-nowrap uppercase">
                          {item.kategori_layanan?.name || 'Kategori Dihapus'}
                        </span>
                      </td>
                      <td><span className="font-bold text-secondary">{item.title}</span></td>
                      <td>
                        {item.badge ? (
                          <span className={`badge badge-sm rounded-full px-3 py-1 font-bold whitespace-nowrap ${
                            item.badge === 'UNGGULAN' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-amber-100 text-amber-600 border border-amber-200'
                          }`}>{item.badge}</span>
                        ) : '-'}
                      </td>
                      <td><span className="text-xs font-semibold text-base-content/60">{item.tag}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(item)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id_layanan)} 
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
          <div className="modal-box rounded-3xl border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-secondary">
              {editId ? 'Edit Layanan' : 'Tambah Layanan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Kategori Induk</span></label>
                {categories.length === 0 ? (
                  <div className="text-sm text-error">Belum ada Kategori Layanan. Harap tambahkan Kategori Layanan terlebih dahulu.</div>
                ) : (
                  <select
                    className={`select select-bordered rounded-xl w-full ${errors.id_kategori_layanan ? 'select-error' : ''}`}
                    value={form.id_kategori_layanan}
                    onChange={(e) => setForm({ ...form, id_kategori_layanan: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.id_kategori_layanan} value={cat.id_kategori_layanan}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.id_kategori_layanan && <span className="text-xs text-error mt-1">{errors.id_kategori_layanan[0]}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">No Urut (e.g. 01, 02)</span></label>
                  <input
                    type="text"
                    className={`input input-bordered rounded-xl w-full ${errors.num ? 'input-error' : ''}`}
                    value={form.num}
                    onChange={(e) => setForm({ ...form, num: e.target.value })}
                    placeholder="01"
                  />
                  {errors.num && <span className="text-xs text-error mt-1">{errors.num[0]}</span>}
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Badge Solusi</span></label>
                  <select
                    className="select select-bordered rounded-xl w-full"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  >
                    <option value="">Tanpa Badge</option>
                    <option value="UNGGULAN">UNGGULAN</option>
                    <option value="POPULER">POPULER</option>
                    <option value="SEGERA">SEGERA</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Nama Layanan / Solusi</span></label>
                <input
                  type="text"
                  className={`input input-bordered rounded-xl w-full ${errors.title ? 'input-error' : ''}`}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Company Profile"
                />
                {errors.title && <span className="text-xs text-error mt-1">{errors.title[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Deskripsi Layanan</span></label>
                <textarea
                  className={`textarea textarea-bordered rounded-xl w-full h-24 ${errors.desc ? 'textarea-error' : ''}`}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Tuliskan deskripsi lengkap apa yang dikerjakan pada paket ini..."
                />
                {errors.desc && <span className="text-xs text-error mt-1">{errors.desc[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Tag / Kelompok (e.g. Web Development)</span></label>
                <input
                  type="text"
                  className={`input input-bordered rounded-xl w-full ${errors.tag ? 'input-error' : ''}`}
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Contoh: Web Development"
                />
                {errors.tag && <span className="text-xs text-error mt-1">{errors.tag[0]}</span>}
              </div>

              <div className="modal-action">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-sm rounded-xl btn-ghost">Batal</button>
                <button type="submit" disabled={saving || categories.length === 0} className="btn btn-sm btn-primary rounded-xl text-white border-none px-5">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
