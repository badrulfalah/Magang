import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function AnggotaTim() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    nama: '',
    jabatan: '',
    urutan: 0,
    foto_file: null
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/anggota-tim?all=1')
      setTeam(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  const openCreate = () => {
    setEditId(null)
    setForm({
      nama: '',
      jabatan: '',
      urutan: team.length + 1,
      foto_file: null
    })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (member) => {
    setEditId(member.id_anggota)
    setForm({
      nama: member.nama,
      jabatan: member.jabatan,
      urutan: member.urutan,
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
      formData.append('nama', form.nama)
      formData.append('jabatan', form.jabatan)
      formData.append('urutan', form.urutan)
      if (form.foto_file) {
        formData.append('foto', form.foto_file)
      }

      if (editId) {
        formData.append('_method', 'PUT')
        await api.post(`/admin/anggota-tim/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/admin/anggota-tim', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      fetchTeam()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus anggota tim ini?')) return
    try {
      await api.delete(`/admin/anggota-tim/${id}`)
      fetchTeam()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Anggota Tim</h1>
          <p className="text-base-content/60 text-sm">Kelola struktur tim perusahaan</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Anggota</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">Urutan</th>
                  <th>Foto</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Dibuat Oleh</th>
                  <th className="w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : team.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  team.map((member) => (
                    <tr key={member.id_anggota} className="hover">
                      <td className="font-semibold text-secondary">{member.urutan}</td>
                      <td>
                        <div className="w-10 h-10 rounded bg-base-200 overflow-hidden flex items-center justify-center">
                          {member.foto ? (
                            <img src={`http://localhost:8000/storage/${member.foto}`} alt={member.nama} className="object-cover w-full h-full" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          )}
                        </div>
                      </td>
                      <td><span className="font-medium text-secondary">{member.nama}</span></td>
                      <td><span>{member.jabatan}</span></td>
                      <td><span className="text-xs text-base-content/50">{member.pembuat?.name}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(member)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id_anggota)} 
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
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit' : 'Tambah'} Anggota Tim</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Nama Lengkap</span></label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                  autoFocus
                />
                {errors.nama && <span className="text-error text-xs mt-1">{errors.nama[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Jabatan</span></label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={form.jabatan}
                  onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                  required
                />
                {errors.jabatan && <span className="text-error text-xs mt-1">{errors.jabatan[0]}</span>}
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

              <div className="form-control">
                <label className="label"><span className="label-text">Foto Profil</span></label>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {errors.foto && <span className="text-error text-xs mt-1">{errors.foto[0]}</span>}
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