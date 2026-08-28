import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function ClientLogo() {
  const [logos, setLogos] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    nama_perusahaan: '',
    urutan: 0,
    logo_file: null
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchLogos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/client-logos', { params: { page, search } })
      setLogos(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchLogos()
  }, [fetchLogos])

  const openCreate = () => {
    setEditId(null)
    setForm({
      nama_perusahaan: '',
      urutan: 0,
      logo_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (l) => {
    setEditId(l.id)
    setForm({
      nama_perusahaan: l.nama_perusahaan,
      urutan: l.urutan || 0,
      logo_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, logo_file: e.target.files[0] })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('nama_perusahaan', form.nama_perusahaan)
      formData.append('urutan', form.urutan)
      if (form.logo_file) {
        formData.append('logo', form.logo_file)
      }

      if (editId) {
        formData.append('_method', 'PUT')
        await api.post(`/admin/client-logos/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/admin/client-logos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      fetchLogos()
      setShowModal(false)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus logo klien ini?')) return
    try {
      await api.delete(`/admin/client-logos/${id}`)
      fetchLogos()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Logo Klien Kerja Sama</h1>
          <p className="text-base-content/60 text-sm">Kelola daftar logo perusahaan klien yang sudah pernah bekerja sama dengan CV Kurva Media Teknologi.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <span>Tambah Logo Klien</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari perusahaan..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} logo</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Logo</th>
                  <th>Nama Perusahaan</th>
                  <th>Urutan Tampil</th>
                  <th className="w-48">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : logos.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  logos.map((l, i) => (
                    <tr key={l.id} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td>
                        <div className="w-10 h-10 rounded-xl bg-base-200 overflow-hidden flex items-center justify-center p-1 border border-base-300">
                          {l.logo_path ? (
                            <img src={`http://localhost:8000/storage/${l.logo_path}`} alt={l.nama_perusahaan} className="object-contain w-full h-full" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{l.nama_perusahaan.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                      </td>
                      <td><span className="font-semibold text-secondary">{l.nama_perusahaan}</span></td>
                      <td><span className="text-xs">{l.urutan}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(l)} className="btn btn-ghost btn-xs text-amber-600 font-bold hover:bg-amber-50">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(l.id)} className="btn btn-ghost btn-xs text-error font-bold hover:bg-red-50">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && meta.last_page > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-200">
              <span className="text-xs text-base-content/50">Halaman {page} dari {meta.last_page}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-outline btn-xs rounded-lg font-bold">Sebelumnya</button>
                <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)} className="btn btn-outline btn-xs rounded-lg font-bold">Selanjutnya</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-3xl max-w-lg border border-base-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-secondary border-b border-base-200 pb-3">
              {editId ? 'Edit Logo Klien' : 'Tambah Logo Klien'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Nama Perusahaan <span className="text-error">*</span></span></label>
                <input
                  type="text"
                  className="input input-bordered rounded-xl text-sm w-full"
                  value={form.nama_perusahaan}
                  onChange={(e) => setForm({ ...form, nama_perusahaan: e.target.value })}
                  placeholder="Contoh: PT. Maju Bersama"
                  required
                />
                {errors.nama_perusahaan && <span className="text-error text-xs mt-1">{errors.nama_perusahaan[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Urutan Tampil</span></label>
                <input
                  type="number"
                  className="input input-bordered rounded-xl text-sm w-full"
                  value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: e.target.value })}
                  placeholder="0"
                />
                {errors.urutan && <span className="text-error text-xs mt-1">{errors.urutan[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">File Logo Perusahaan <span className="text-error">*</span></span></label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary rounded-xl text-xs w-full"
                  required={!editId}
                />
                {errors.logo && <span className="text-error text-xs mt-1">{errors.logo[0]}</span>}
              </div>

              <div className="modal-action border-t border-base-200 pt-4 flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline btn-sm rounded-xl px-4 font-bold">Batal</button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm rounded-xl px-4 text-white font-bold border-none">
                  {saving && <span className="loading loading-spinner loading-xs"></span>}
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
