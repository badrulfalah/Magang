import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function RoleList() {
  const [roles, setRoles] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', permissions: [] })
  const [allPermissions, setAllPermissions] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/roles', { params: { page, search } })
      setRoles(res.data.data)
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchRoles() }, [fetchRoles])

  useEffect(() => {
    api.get('/permissions?all=1').then((res) => setAllPermissions(res.data))
  }, [])

  const openCreate = () => {
    setEditId(null)
    setForm({ name: '', permissions: [] })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = async (role) => {
    try {
      const res = await api.get(`/roles/${role.id}`)
      setEditId(role.id)
      setForm({ 
        name: res.data.name, 
        permissions: res.data.permissions?.map((p) => p.id) || [] 
      })
      setErrors({})
      setShowModal(true)
    } catch (err) {
      console.error(err)
    }
  }

  const togglePermission = (permId) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId) 
        ? prev.permissions.filter((p) => p !== permId) 
        : [...prev.permissions, permId],
    }))
  }

  const toggleAll = () => {
    if (form.permissions.length === allPermissions.length) {
      setForm((prev) => ({ ...prev, permissions: [] }))
    } else {
      setForm((prev) => ({ ...prev, permissions: allPermissions.map((p) => p.id) }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/roles/${editId}`, form)
      } else {
        await api.post('/roles', form)
      }
      setShowModal(false)
      fetchRoles()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus role ini?')) return
    await api.delete(`/roles/${id}`)
    fetchRoles()
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Roles</h1>
          <p className="text-base-content/60 text-sm">Kelola role pengguna</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Role</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden w-full max-w-full">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input type="text" placeholder="Cari role..." className="input input-bordered rounded-xl input-sm w-full max-w-xs" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            <span className="text-sm text-base-content/60">{meta.total || 0} role</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Nama</th>
                  <th>Permissions</th>
                  <th>Users</th>
                  <th className="w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : roles.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  roles.map((role, i) => (
                    <tr key={role.id} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td><span className="font-semibold text-secondary">{role.name}</span></td>
                      <td><span className="badge badge-sm bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 font-bold whitespace-nowrap">{role.permissions_count} permissions</span></td>
                      <td><span className="badge badge-sm bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-3 py-1 font-bold whitespace-nowrap">{role.users_count} users</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(role)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(role.id)} 
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
                <button className="join-item btn btn-sm" disabled={!meta.prev_page_url} onClick={() => setPage(page - 1)}>«</button>
                <button className="join-item btn btn-sm btn-disabled">Hal {meta.current_page}/{meta.last_page}</button>
                <button className="join-item btn btn-sm" disabled={!meta.next_page_url} onClick={() => setPage(page + 1)}>»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-3xl max-w-lg">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit' : 'Tambah'} Role</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Nama Role</span></label>
                <input type="text" className="input input-bordered input-sm w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                {errors.name && <span className="text-error text-xs mt-1">{errors.name[0]}</span>}
              </div>

              <div className="form-control">
                <div className="flex justify-between items-center mb-2">
                  <label className="label p-0"><span className="label-text">Permissions</span></label>
                  <button type="button" className="btn btn-ghost btn-xs" onClick={toggleAll}>
                    {form.permissions.length === allPermissions.length ? 'Hapus Semua' : 'Pilih Semua'}
                  </button>
                </div>
                <div className="border border-base-300 rounded-lg p-3 max-h-64 overflow-y-auto space-y-1">
                  {allPermissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 px-2 py-1.5 rounded">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={form.permissions.includes(perm.id)} onChange={() => togglePermission(perm.id)} />
                      <span className="text-sm">{perm.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
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
