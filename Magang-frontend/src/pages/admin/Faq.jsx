import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function Faq() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    pertanyaan: '',
    jawaban: '',
    urutan: 0
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchFaqs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/faq?all=1')
      setFaqs(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  const openCreate = () => {
    setEditId(null)
    setForm({
      pertanyaan: '',
      jawaban: '',
      urutan: faqs.length + 1
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (faq) => {
    setEditId(faq.id_faq)
    setForm({
      pertanyaan: faq.pertanyaan,
      jawaban: faq.jawaban,
      urutan: faq.urutan
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
        await api.put(`/admin/faq/${editId}`, form)
      } else {
        await api.post('/admin/faq', form)
      }
      setShowModal(false)
      fetchFaqs()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus FAQ ini?')) return
    try {
      await api.delete(`/admin/faq/${id}`)
      fetchFaqs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">FAQ</h1>
          <p className="text-base-content/60 text-sm">Kelola tanya jawab situs</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah FAQ</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">Urutan</th>
                  <th>Pertanyaan</th>
                  <th>Jawaban</th>
                  <th>Dibuat Oleh</th>
                  <th className="w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : faqs.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq.id_faq} className="hover">
                      <td className="font-semibold text-secondary">{faq.urutan}</td>
                      <td><span className="font-medium text-secondary">{faq.pertanyaan}</span></td>
                      <td className="max-w-xs"><p className="text-xs line-clamp-2">{faq.jawaban}</p></td>
                      <td><span className="text-xs text-base-content/50">{faq.pembuat?.name}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(faq)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(faq.id_faq)} 
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
        </div>
      </div>

      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-3xl">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit' : 'Tambah'} FAQ</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Pertanyaan</span></label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={form.pertanyaan}
                  onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
                  required
                  autoFocus
                />
                {errors.pertanyaan && <span className="text-error text-xs mt-1">{errors.pertanyaan[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Jawaban</span></label>
                <textarea
                  className="textarea textarea-bordered h-28 w-full"
                  value={form.jawaban}
                  onChange={(e) => setForm({ ...form, jawaban: e.target.value })}
                  required
                ></textarea>
                {errors.jawaban && <span className="text-error text-xs mt-1">{errors.jawaban[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Urutan Tampil</span></label>
                <input
                  type="number"
                  className="input input-bordered input-sm w-full"
                  value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
                  required
                />
                {errors.urutan && <span className="text-error text-xs mt-1">{errors.urutan[0]}</span>}
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