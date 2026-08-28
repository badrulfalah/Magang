import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function Keunggulan() {
  const [keunggulans, setKeunggulans] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    icon: '',
    urutan: 0
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchKeunggulans = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/keunggulans', { params: { page, search } })
      setKeunggulans(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchKeunggulans()
  }, [fetchKeunggulans])

  const openCreate = () => {
    setEditId(null)
    setForm({
      judul: '',
      deskripsi: '',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      urutan: 0
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (k) => {
    setEditId(k.id)
    setForm({
      judul: k.judul,
      deskripsi: k.deskripsi,
      icon: k.icon || 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      urutan: k.urutan || 0
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
        await api.put(`/admin/keunggulans/${editId}`, form)
      } else {
        await api.post('/admin/keunggulans', form)
      }
      fetchKeunggulans()
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
    if (!window.confirm('Yakin ingin menghapus keunggulan ini?')) return
    try {
      await api.delete(`/admin/keunggulans/${id}`)
      fetchKeunggulans()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Keunggulan Kurva</h1>
          <p className="text-base-content/60 text-sm">Kelola daftar keunggulan "Mengapa Memilih Kurva" di halaman depan.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <span>Tambah Keunggulan</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari keunggulan..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Judul</th>
                  <th>Deskripsi</th>
                  <th>Urutan</th>
                  <th className="w-48">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : keunggulans.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  keunggulans.map((k, i) => (
                    <tr key={k.id} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td><span className="font-semibold text-secondary">{k.judul}</span></td>
                      <td className="max-w-xs"><p className="text-xs line-clamp-2">{k.deskripsi}</p></td>
                      <td><span className="text-xs">{k.urutan}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(k)} className="btn btn-ghost btn-xs text-amber-600 font-bold hover:bg-amber-50">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(k.id)} className="btn btn-ghost btn-xs text-error font-bold hover:bg-red-50">
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
              {editId ? 'Edit Keunggulan' : 'Tambah Keunggulan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Judul Keunggulan <span className="text-error">*</span></span></label>
                <input
                  type="text"
                  className="input input-bordered rounded-xl text-sm w-full"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Contoh: Kualitas Code Bersih"
                  required
                />
                {errors.judul && <span className="text-error text-xs mt-1">{errors.judul[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Deskripsi <span className="text-error">*</span></span></label>
                <textarea
                  className="textarea textarea-bordered rounded-xl text-sm h-24 leading-relaxed w-full"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Deskripsi penjelasan keunggulan..."
                  required
                />
                {errors.deskripsi && <span className="text-error text-xs mt-1">{errors.deskripsi[0]}</span>}
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
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Icon SVG Path (Optional)</span></label>
                <input
                  type="text"
                  className="input input-bordered rounded-xl text-sm w-full"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="M10 20l4-16m4..."
                />
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
