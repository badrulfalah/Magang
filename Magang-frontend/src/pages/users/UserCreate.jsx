import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function UserCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', status: 'aktif', google_id: '', roles: [] })
  const [allRoles, setAllRoles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/roles?all=1').then((res) => setAllRoles(res.data))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleRole = (id) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(id) ? prev.roles.filter((r) => r !== id) : [...prev.roles, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await api.post('/users', form)
      navigate('/users')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Tambah User</h1>
        <p className="text-base-content/60 text-sm">Buat akun pengguna baru</p>
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
              <span>Password</span>
              <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" value={form.password} onChange={handleChange} required />
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
                Simpan
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/users')}>Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
