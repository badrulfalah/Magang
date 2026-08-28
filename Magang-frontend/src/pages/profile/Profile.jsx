import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import api from '../../api/axios'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileErrors({})
    setProfileSuccess('')
    setProfileLoading(true)
    try {
      await api.put('/profile', profileForm)
      setProfileSuccess('Profil berhasil diperbarui')
      refreshUser()
    } catch (err) {
      if (err.response?.status === 422) setProfileErrors(err.response.data.errors || {})
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordErrors({})
    setPasswordSuccess('')
    setPasswordLoading(true)
    try {
      await api.put('/profile/password', passwordForm)
      setPasswordSuccess('Password berhasil diubah')
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      if (err.response?.status === 422) setPasswordErrors(err.response.data.errors || {})
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    setAvatarLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatarFile(null)
      setAvatarPreview(null)
      await refreshUser()
    } catch (err) {
      console.error(err)
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-content">Profil Pengguna</h1>
        <p className="text-base-content/60 text-sm">Kelola detail profil dan keamanan akun Anda</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Side: Avatar Card */}
        <div className="w-full lg:w-80 shrink-0 flex">
          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-3xl p-6 flex flex-col items-center text-center space-y-4 w-full justify-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full ring-4 ring-primary/20 overflow-hidden flex items-center justify-center bg-base-200 relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="object-cover w-full h-full" />
                ) : user?.avatar ? (
                  <img src={`http://localhost:8000/storage/${user.avatar}`} alt={user.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center w-full h-full text-3xl font-black">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <input type="file" id="avatarInput" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              
              {!avatarFile && (
                <label htmlFor="avatarInput" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              )}
            </div>

            {avatarFile && (
              <div className="flex gap-2">
                <button onClick={handleAvatarUpload} className="btn btn-primary btn-xs rounded-lg px-3" disabled={avatarLoading}>
                  {avatarLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Simpan Foto'}
                </button>
                <button onClick={() => { setAvatarFile(null); setAvatarPreview(null) }} className="btn btn-ghost btn-xs rounded-lg">Batal</button>
              </div>
            )}

            <div className="space-y-1">
              <h2 className="font-extrabold text-secondary text-lg leading-tight">{user?.name}</h2>
              <p className="text-xs text-base-content/50 font-medium">{user?.email}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center pt-2">
              {user?.roles?.map((r) => (
                <span key={r.id} className="badge badge-primary font-bold text-xs uppercase px-2.5 py-1 rounded-md border-0 text-primary-content">
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Tab Forms */}
        <div className="flex-1 w-full space-y-4 self-stretch flex flex-col">
          <div className="flex gap-2 border-b border-base-200 pb-px shrink-0">
            <button 
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${tab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-base-content/50 hover:text-base-content'}`} 
              onClick={() => setTab('profile')}
            >
              Informasi Profil
            </button>
            <button 
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${tab === 'password' ? 'border-primary text-primary' : 'border-transparent text-base-content/50 hover:text-base-content'}`} 
              onClick={() => setTab('password')}
            >
              Ubah Password
            </button>
          </div>

          {tab === 'profile' && (
            <div className="card bg-base-100 border border-base-200 shadow-sm rounded-3xl p-6 flex-1 flex flex-col justify-between">
              {profileSuccess && (
                <div className="alert alert-success alert-soft mb-4 text-xs font-semibold rounded-2xl bg-green-500/10 border-0 text-green-700">
                  <span>{profileSuccess}</span>
                </div>
              )}
              <form onSubmit={handleProfileSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs font-bold text-secondary uppercase">Nama Lengkap</span></label>
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap" 
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                      required 
                    />
                    {profileErrors.name && <span className="text-error text-xs mt-1">{profileErrors.name[0]}</span>}
                  </div>

                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs font-bold text-secondary uppercase">Alamat Email</span></label>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm" 
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                      required 
                    />
                    {profileErrors.email && <span className="text-error text-xs mt-1">{profileErrors.email[0]}</span>}
                  </div>

                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs font-bold text-secondary uppercase">Nomor Telepon</span></label>
                    <input 
                      type="text" 
                      placeholder="Phone" 
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm" 
                      value={profileForm.phone} 
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
                    />
                    {profileErrors.phone && <span className="text-error text-xs mt-1">{profileErrors.phone[0]}</span>}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button type="submit" className="btn btn-primary btn-sm rounded-xl px-5 text-white" disabled={profileLoading}>
                    {profileLoading && <span className="loading loading-spinner loading-xs"></span>}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === 'password' && (
            <div className="card bg-base-100 border border-base-200 shadow-sm rounded-3xl p-6 flex-1 flex flex-col justify-between">
              {passwordSuccess && (
                <div className="alert alert-success alert-soft mb-4 text-xs font-semibold rounded-2xl bg-green-500/10 border-0 text-green-700">
                  <span>{passwordSuccess}</span>
                </div>
              )}
              <form onSubmit={handlePasswordSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs font-bold text-secondary uppercase">Password Saat Ini</span></label>
                    <input 
                      type="password" 
                      placeholder="Masukkan password saat ini" 
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm" 
                      value={passwordForm.current_password} 
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} 
                      required 
                    />
                    {passwordErrors.current_password && <span className="text-error text-xs mt-1">{passwordErrors.current_password[0]}</span>}
                  </div>

                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs font-bold text-secondary uppercase">Password Baru</span></label>
                    <input 
                      type="password" 
                      placeholder="Minimal 8 karakter" 
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm" 
                      value={passwordForm.password} 
                      onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} 
                      required 
                    />
                    {passwordErrors.password && <span className="text-error text-xs mt-1">{passwordErrors.password[0]}</span>}
                  </div>

                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs font-bold text-secondary uppercase">Konfirmasi Password Baru</span></label>
                    <input 
                      type="password" 
                      placeholder="Ketik ulang password baru" 
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm" 
                      value={passwordForm.password_confirmation} 
                      onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button type="submit" className="btn btn-primary btn-sm rounded-xl px-5 text-white" disabled={passwordLoading}>
                    {passwordLoading && <span className="loading loading-spinner loading-xs"></span>}
                    Ubah Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
