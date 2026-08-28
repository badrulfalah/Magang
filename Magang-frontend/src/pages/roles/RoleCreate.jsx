import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function RoleCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', permissions: [] })
  const [allPermissions, setAllPermissions] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/permissions?all=1').then((res) => setAllPermissions(res.data))
  }, [])

  const togglePermission = (id) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id) ? prev.permissions.filter((p) => p !== id) : [...prev.permissions, id],
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
    setLoading(true)
    try {
      await api.post('/roles', form)
      navigate('/roles')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Tambah Role</h1>
        <p className="text-base-content/60 text-sm">Buat role baru beserta permissions</p>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="floating-label">
              <span>Nama Role</span>
              <input type="text" placeholder="Nama Role" className="input input-bordered w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              {errors.name && <span className="text-error text-xs mt-1">{errors.name[0]}</span>}
            </label>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label"><span className="label-text font-medium">Permissions</span></label>
                <button type="button" className="btn btn-ghost btn-xs" onClick={toggleAll}>
                  {form.permissions.length === allPermissions.length ? 'Hapus Semua' : 'Pilih Semua'}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto border border-base-300 rounded-lg p-3">
                {allPermissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 px-2 py-1 rounded">
                    <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={form.permissions.includes(perm.id)} onChange={() => togglePermission(perm.id)} />
                    <span className="text-sm">{perm.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading && <span className="loading loading-spinner loading-xs"></span>}
                Simpan
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/roles')}>Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
