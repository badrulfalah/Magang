import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Produk() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form states
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [nama, setNama] = useState('')
  const [fotoSampul, setFotoSampul] = useState(null)
  const [fotoPreview, setFotoPreview] = useState('')
  const [deskripsiSingkat, setDeskripsiSingkat] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [spesifikasi, setSpesifikasi] = useState('')
  const [status, setStatus] = useState('aktif')

  // Toast notification states
  const [toast, setToast] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type })
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const fetchProducts = () => {
    setLoading(true)
    api.get(`/admin/produk?search=${search}&page=${page}`)
      .then(res => {
        setProducts(res.data.data || [])
        setTotalPages(res.data.last_page || 1)
      })
      .catch(err => {
        console.error(err)
        showToastMsg('Gagal memuat daftar produk.', 'error')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [page, search])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10240 * 1024) {
        showToastMsg('Ukuran file maksimal adalah 10MB.', 'error')
        e.target.value = ''
        return
      }
      setFotoSampul(file)
      setFotoPreview(URL.createObjectURL(file))
    }
  }

  const openCreateModal = () => {
    setEditId(null)
    setNama('')
    setFotoSampul(null)
    setFotoPreview('')
    setDeskripsiSingkat('')
    setDeskripsi('')
    setSpesifikasi('')
    setStatus('aktif')
    setShowModal(true)
  }

  const openEditModal = (prod) => {
    setEditId(prod.id_produk)
    setNama(prod.nama)
    setFotoSampul(null)
    setFotoPreview(prod.foto_sampul ? `http://localhost:8000/storage/${prod.foto_sampul}` : '')
    setDeskripsiSingkat(prod.deskripsi_singkat || '')
    setDeskripsi(prod.deskripsi || '')
    setSpesifikasi(prod.spesifikasi || '')
    setStatus(prod.status)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nama) {
      showToastMsg('Nama produk wajib diisi.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('nama', nama)
    formData.append('deskripsi_singkat', deskripsiSingkat)
    formData.append('deskripsi', deskripsi)
    formData.append('spesifikasi', spesifikasi)
    formData.append('status', status)

    if (fotoSampul) {
      formData.append('foto_sampul', fotoSampul)
    }

    try {
      if (editId) {
        // Spoofing PUT request
        formData.append('_method', 'PUT')
        await api.post(`/admin/produk/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToastMsg('Produk berhasil diperbarui.')
      } else {
        await api.post('/admin/produk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToastMsg('Produk baru berhasil ditambahkan.')
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      console.error(err)
      showToastMsg(err.response?.data?.message || 'Gagal menyimpan produk.', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini? Sesi obrolan terkait produk mungkin akan kehilangan referensi.')) return
    try {
      await api.delete(`/admin/produk/${id}`)
      showToastMsg('Produk berhasil dihapus.')
      fetchProducts()
    } catch (err) {
      console.error(err)
      showToastMsg('Gagal menghapus produk.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      
      {/* ── HEADER & TOAST ── */}
      {showToast && toast && (
        <div className="toast toast-end toast-bottom z-[999] animate-[fadeIn_0.2s_ease]">
          <div className={`alert ${toast.type === 'error' ? 'alert-error text-white' : 'alert-success text-white'} rounded-xl shadow-lg flex items-center gap-2 text-sm border-0 font-semibold`}>
            {toast.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-secondary">Kelola Produk & Portofolio</h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">Buat, perbarui, dan nonaktifkan produk sistem TI Anda.</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90 self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* ── FILTER & SEARCH ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-base-content/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            className="input input-bordered w-full pl-9 pr-4 text-sm rounded-xl focus:border-primary/50 focus:outline-none"
            placeholder="Cari berdasarkan nama atau spesifikasi..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-base-200/50 text-secondary border-b border-base-200">
                <th className="font-bold text-xs">Produk</th>
                <th className="font-bold text-xs">Deskripsi Singkat</th>
                <th className="font-bold text-xs">Spesifikasi Utama</th>
                <th className="font-bold text-xs text-center">Status</th>
                <th className="font-bold text-xs text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/40 font-medium">Belum ada data produk.</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id_produk} className="hover:bg-base-100/50 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        {prod.foto_sampul && (
                          <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 overflow-hidden shrink-0">
                            <img src={`http://localhost:8000/storage/${prod.foto_sampul}`} alt={prod.nama} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="font-bold text-secondary max-w-[200px] truncate" title={prod.nama}>
                          {prod.nama}
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[250px] truncate text-xs text-base-content/75" title={prod.deskripsi_singkat}>
                      {prod.deskripsi_singkat || '-'}
                    </td>
                    <td className="max-w-[200px] truncate text-xs text-base-content/75 font-mono" title={prod.spesifikasi}>
                      {prod.spesifikasi || '-'}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${prod.status === 'aktif' ? 'bg-emerald-500 text-white border-0' : 'bg-rose-500 text-white border-0'} font-semibold text-xs rounded-md px-2.5 py-1`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(prod)} 
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id_produk)} 
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
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-base-200 flex justify-between items-center bg-base-50">
            <span className="text-xs text-base-content/60 font-semibold">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-outline btn-xs rounded-lg font-bold"
              >
                Sebelumnya
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-outline btn-xs rounded-lg font-bold"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {showModal && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-3xl max-w-2xl border border-base-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-secondary border-b border-base-200 pb-3">
              {editId ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Nama */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Nama Produk / Portofolio <span className="text-error">*</span></span></label>
                <input
                  type="text"
                  className="input input-bordered rounded-xl text-sm w-full"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Sistem Informasi Akademik SIAKAD"
                  required
                />
              </div>

              {/* Cover Photo */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Foto Sampul Produk</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary rounded-xl text-xs w-full"
                />
                {fotoPreview && (
                  <div className="mt-2 relative w-32 aspect-video rounded-lg overflow-hidden border border-base-300">
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Deskripsi Singkat */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Deskripsi Singkat (Ringkasan)</span></label>
                <textarea
                  className="textarea textarea-bordered rounded-xl text-sm h-16 leading-relaxed"
                  value={deskripsiSingkat}
                  onChange={(e) => setDeskripsiSingkat(e.target.value)}
                  placeholder="Tuliskan rangkuman ringkas mengenai produk ini..."
                />
              </div>

              {/* Penjelasan & Fitur */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Deskripsi & Fitur Utama</span></label>
                <textarea
                  className="textarea textarea-bordered rounded-xl text-sm h-36 leading-relaxed"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan detail fitur produk secara terperinci..."
                />
              </div>

              {/* Spesifikasi Teknis */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Spesifikasi Teknis (Satu per baris)</span></label>
                <textarea
                  className="textarea textarea-bordered rounded-xl text-sm h-24 leading-relaxed"
                  value={spesifikasi}
                  onChange={(e) => setSpesifikasi(e.target.value)}
                  placeholder="Contoh:&#10;PHP 8.2 & Laravel 11&#10;ReactJS & TailwindCSS&#10;PostgreSQL"
                />
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Status</span></label>
                <select
                  className="select select-bordered rounded-xl text-sm w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="aktif">Aktif (Tampil di Publik)</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* Actions */}
              <div className="modal-action border-t border-base-200 pt-4 flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline btn-sm rounded-xl px-4 font-bold">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary btn-sm rounded-xl px-4 text-white font-bold border-none">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
