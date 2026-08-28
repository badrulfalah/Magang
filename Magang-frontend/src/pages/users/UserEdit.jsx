import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', status: 'aktif', google_id: '', roles: [] })
  const [allRoles, setAllRoles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get('/roles?all=1'),
    ]).then(([userRes, rolesRes]) => {
      const u = userRes.data
      setForm({
        name: u.name,
        email: u.email,
        password: '',
        phone: u.phone || '',
        status: u.status || 'aktif',
        google_id: u.google_id || '',
        roles: u.roles?.map((r) => r.id) || []
      })
      setAllRoles(rolesRes.data)
    }).finally(() => setFetching(false))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleRole = (roleId) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId) ? prev.roles.filter((r) => r !== roleId) : [...prev.roles, roleId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await api.put(`/users/${id}`, form)
      navigate('/users')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Edit User</h1>
        <p className="text-base-content/60 text-sm">Ubah data pengguna</p>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="floating-label">
              <span>Nama</span>
              <input type="text" name="name" placeholder="Nama" className="input input-bordered w-full" value={form.name} onChange={handleChange} required />
              {errors.name && <span className="text-error text-xs mt-1">{errors.name[0]}</span>}
            </label>

             <label className="floating-label">
              <span>Email</span>
              <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" value={form.email} onChange={handleChange} required />
              {errors.email && <span className="text-error text-xs mt-1">{errors.email[0]}</span>}
            </label>

            <div>
              <label className="label"><span className="label-text">No. HP</span></label>
              <input type="text" name="phone" placeholder="No. HP" className="input input-bordered w-full" value={form.phone} onChange={handleChange} />
              {errors.phone && <span className="text-error text-xs mt-1">{errors.phone[0]}</span>}
            </div>

            <div>
              <label className="label"><span className="label-text">Status</span></label>
              <select name="status" className="select select-bordered w-full" value={form.status} onChange={handleChange}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
                <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
              </select>
              {errors.status && <span className="text-error text-xs mt-1">{errors.status[0]}</span>}
            </div>

            <div>
              <label className="label"><span className="label-text">Google ID</span></label>
              <input type="text" name="google_id" placeholder="Google ID" className="input input-bordered w-full" value={form.google_id} onChange={handleChange} />
              {errors.google_id && <span className="text-error text-xs mt-1">{errors.google_id[0]}</span>}
            </div>

            <label className="floating-label">
              <span>Password (kosongkan jika tidak diubah)</span>
              <input type="password" name="password" placeholder="Password baru" className="input input-bordered w-full" value={form.password} onChange={handleChange} />
              {errors.password && <span className="text-error text-xs mt-1">{errors.password[0]}</span>}
            </label>

            <div>
              <label className="label"><span className="label-text font-medium">Roles</span></label>
              <div className="flex flex-wrap gap-2">
                {allRoles.map((role) => (
                  <label key={role.id} className="cursor-pointer">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={form.roles.includes(role.id)} onChange={() => toggleRole(role.id)} />
                    <span className="ml-1.5 text-sm">{role.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading && <span className="loading loading-spinner loading-xs"></span>}
                Update
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/users')}>Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
