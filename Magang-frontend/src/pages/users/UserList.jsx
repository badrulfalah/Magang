import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', status: 'aktif', google_id: '', roles: [] })
  const [allRoles, setAllRoles] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/users', { params: { page, search } })
      setUsers(res.data.data)
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    api.get('/roles?all=1').then((res) => setAllRoles(res.data))
  }, [])

  const openCreate = () => {
    setEditId(null)
    setForm({ name: '', email: '', password: '', phone: '', status: 'aktif', google_id: '', roles: [] })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (user) => {
    setEditId(user.id)
    setForm({ 
      name: user.name, 
      email: user.email, 
      password: '', 
      phone: user.phone || '',
      status: user.status || 'aktif',
      google_id: user.google_id || '',
      roles: user.roles?.map((r) => r.id) || [] 
    })
    setErrors({})
    setShowModal(true)
  }

  const toggleRole = (roleId) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId) 
        ? prev.roles.filter((r) => r !== roleId) 
        : [...prev.roles, roleId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/users/${editId}`, form)
      } else {
        await api.post('/users', form)
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return
    await api.delete(`/users/${id}`)
    fetchUsers()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Users</h1>
          <p className="text-base-content/60 text-sm">Kelola semua pengguna sistem</p>
        </div>
        <button 
          onClick={openCreate} 
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah User</span>
        </button>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari user..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} user</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. HP</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Google ID</th>
                  <th className="w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  users.map((user, i) => (
                    <tr key={user.id} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              {user.avatar ? (
                                <img src={`http://localhost:8000/storage/${user.avatar}`} alt={user.name} />
                              ) : (
                                <div className="bg-neutral text-neutral-content w-8 h-8 flex items-center justify-center rounded-full">
                                  <span className="text-xs">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="text-base-content/70">{user.email}</td>
                      <td className="text-base-content/70">{user.phone || '-'}</td>
                      <td>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles?.map((r) => (
                            <span key={r.id} className="badge badge-primary badge-sm badge-outline">{r.name}</span>
                          ))}
                          {(!user.roles || user.roles.length === 0) && <span className="text-base-content/40 text-xs">-</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-xs ${user.status === 'aktif' ? 'badge-success' : user.status === 'nonaktif' ? 'badge-error' : 'badge-warning'}`}>
                          {user.status || 'aktif'}
                        </span>
                      </td>
                      <td className="text-base-content/60 text-xs font-mono">{user.google_id || '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(user)} 
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-amber-200/50 dark:border-amber-900/50 transition-all duration-200 hover:scale-105"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)} 
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
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit' : 'Tambah'} User</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Nama</span></label>
                <input type="text" className="input input-bordered input-sm w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                {errors.name && <span className="text-error text-xs mt-1">{errors.name[0]}</span>}
              </div>

               <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="email" className="input input-bordered input-sm w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                {errors.email && <span className="text-error text-xs mt-1">{errors.email[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">No. HP</span></label>
                <input type="text" className="input input-bordered input-sm w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <span className="text-error text-xs mt-1">{errors.phone[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Status</span></label>
                <select className="select select-bordered select-sm w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                </select>
                {errors.status && <span className="text-error text-xs mt-1">{errors.status[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Google ID</span></label>
                <input type="text" className="input input-bordered input-sm w-full" value={form.google_id} onChange={(e) => setForm({ ...form, google_id: e.target.value })} />
                {errors.google_id && <span className="text-error text-xs mt-1">{errors.google_id[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">{editId ? 'Password (kosongkan jika tidak diubah)' : 'Password'}</span></label>
                <input type="password" className="input input-bordered input-sm w-full" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} />
                {errors.password && <span className="text-error text-xs mt-1">{errors.password[0]}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Roles</span></label>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map((role) => (
                    <label key={role.id} className="cursor-pointer flex items-center gap-1.5">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={form.roles.includes(role.id)} onChange={() => toggleRole(role.id)} />
                      <span className="text-sm">{role.name}</span>
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
