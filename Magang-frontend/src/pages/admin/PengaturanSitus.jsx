import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function PengaturanSitus() {
  const [form, setForm] = useState({
    nama_perusahaan: '',
    alamat: '',
    no_telp: '',
    email_perusahaan: '',
    hero_tagline: '',
    hero_title: '',
    sejarah_perusahaan: '',
    visi_misi: '',
    keunggulan_1: '',
    keunggulan_2: '',
    keunggulan_3: '',
    jumlah_klien: '',
    jumlah_proyek: '',
    tahun_berdiri: '',
    logo: '',
    favicon: '',
    banner_hero: '',
    bg_contact: '',
    bg_about: '',
    keunggulan_visual: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  const [logoFile, setLogoFile] = useState(null)
  const [faviconFile, setFaviconFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [bgContactFile, setBgContactFile] = useState(null)
  const [bgAboutFile, setBgAboutFile] = useState(null)
  const [keunggulanVisualFile, setKeunggulanVisualFile] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadingBgContact, setUploadingBgContact] = useState(false)
  const [uploadingBgAbout, setUploadingBgAbout] = useState(false)
  const [uploadingKeunggulanVisual, setUploadingKeunggulanVisual] = useState(false)

  const fetchSettings = () => {
    api.get('/admin/pengaturan-situs?all=1')
      .then(res => {
        const data = res.data || []
        const keys = [
          'nama_perusahaan', 'alamat', 'no_telp', 'email_perusahaan',
          'hero_tagline', 'hero_title',
          'sejarah_perusahaan', 'visi_misi', 'keunggulan_1', 'keunggulan_2',
          'keunggulan_3', 'jumlah_klien', 'jumlah_proyek', 'tahun_berdiri',
          'logo', 'favicon', 'banner_hero', 'bg_contact', 'bg_about', 'keunggulan_visual'
        ]
        const currentForm = {}
        keys.forEach(k => { currentForm[k] = '' })
        
        data.forEach(item => {
          if (item.kunci in currentForm) {
            currentForm[item.kunci] = item.nilai
          }
        })
        setForm(currentForm)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpload = async (kunci, file, setUploading, setFile) => {
    if (!file) return
    setUploading(true)
    setSuccess('')
    setErrors({})
    try {
      const formData = new FormData()
      formData.append('kunci', kunci)
      formData.append('file', file)
      
      const res = await api.post('/admin/pengaturan-situs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setForm(prev => ({ ...prev, [kunci]: res.data.nilai + '?v=' + Date.now() }))
      setFile(null)
      setSuccess(`${kunci === 'logo' ? 'Logo' : kunci === 'banner_hero' ? 'Banner Hero' : kunci === 'bg_contact' ? 'Background Kontak' : kunci === 'bg_about' ? 'Background Tentang Kami' : kunci === 'keunggulan_visual' ? 'Visual Keunggulan' : 'Favicon'} berhasil diperbarui!`)
      if (kunci === 'logo') {
        window.dispatchEvent(new Event('logo-updated'))
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.file?.[0] || err.message || 'Upload gagal'
      setErrors({ upload: [msg] })
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setErrors({})
    setSaving(true)
    try {
      const { logo: _logo, favicon: _favicon, banner_hero: _banner_hero, bg_contact: _bg_contact, bg_about: _bg_about, keunggulan_visual: _keunggulan_visual, ...textSettings } = form
      const settingsArray = Object.keys(textSettings).map(key => ({
        kunci: key,
        nilai: form[key]
      }))
      
      await api.post('/admin/pengaturan-situs/bulk', { settings: settingsArray })
      setSuccess('Pengaturan situs berhasil diperbarui!')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Pengaturan Situs</h1>
        <p className="text-base-content/60 text-sm">Kelola informasi instansi dan konten halaman utama</p>
      </div>

      {success && <div className="alert alert-success alert-sm rounded">{success}</div>}
      
      {Object.keys(errors).length > 0 && (
        <div className="alert alert-error alert-sm rounded">
          <ul className="list-disc list-inside">
            {Object.keys(errors).map(key => (
              <li key={key}>{errors[key][0]}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Logo Perusahaan</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-24 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center border border-base-300">
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Preview Logo" className="object-contain w-full h-full p-2" />
                ) : form.logo ? (
                  <img src={`http://localhost:8000/storage/${form.logo}`} alt="Logo Perusahaan" className="object-contain w-full h-full p-2" />
                ) : (
                  <span className="text-xs text-base-content/40">Belum ada logo</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              {logoFile && (
                <button
                  type="button"
                  onClick={() => handleUpload('logo', logoFile, setUploadingLogo, setLogoFile)}
                  className="btn btn-primary btn-sm w-full"
                  disabled={uploadingLogo}
                >
                  {uploadingLogo && <span className="loading loading-spinner loading-xs"></span>}
                  {uploadingLogo ? 'Mengupload...' : 'Upload Logo'}
                </button>
              )}
              {errors.upload && <p className="text-error text-xs">{errors.upload[0]}</p>}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Favicon Situs</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center border border-base-300">
                {form.favicon ? (
                  <img src={`http://localhost:8000/storage/${form.favicon}`} alt="Favicon" className="object-contain w-full h-full p-2" />
                ) : (
                  <span className="text-xs text-base-content/40">Favicon</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              {faviconFile && (
                <button
                  type="button"
                  onClick={() => handleUpload('favicon', faviconFile, setUploadingFavicon, setFaviconFile)}
                  className="btn btn-primary btn-sm w-full text-white"
                  disabled={uploadingFavicon}
                >
                  {uploadingFavicon && <span className="loading loading-spinner loading-xs"></span>}
                  Upload Favicon
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Background Tentang Kami</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center border border-base-300 relative">
                {form.bg_about ? (
                  <img src={`http://localhost:8000/storage/${form.bg_about}`} alt="Background Tentang Kami" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-base-content/40">Belum ada Background</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => setBgAboutFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              {bgAboutFile && (
                <button
                  type="button"
                  onClick={() => handleUpload('bg_about', bgAboutFile, setUploadingBgAbout, setBgAboutFile)}
                  className="btn btn-primary btn-sm w-full text-white"
                  disabled={uploadingBgAbout}
                >
                  {uploadingBgAbout && <span className="loading loading-spinner loading-xs"></span>}
                  Upload Background Tentang Kami
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Background Kontak</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center border border-base-300 relative">
                {form.bg_contact ? (
                  <img src={`http://localhost:8000/storage/${form.bg_contact}`} alt="Background Kontak" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-base-content/40">Belum ada Background</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => setBgContactFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              {bgContactFile && (
                <button
                  type="button"
                  onClick={() => handleUpload('bg_contact', bgContactFile, setUploadingBgContact, setBgContactFile)}
                  className="btn btn-primary btn-sm w-full text-white"
                  disabled={uploadingBgContact}
                >
                  {uploadingBgContact && <span className="loading loading-spinner loading-xs"></span>}
                  Upload Background Kontak
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Visual Keunggulan</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center border border-base-300 relative">
                {form.keunggulan_visual ? (
                  <img src={`http://localhost:8000/storage/${form.keunggulan_visual}`} alt="Visual Keunggulan" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-base-content/40">Belum ada Visual Keunggulan</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => setKeunggulanVisualFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              {keunggulanVisualFile && (
                <button
                  type="button"
                  onClick={() => handleUpload('keunggulan_visual', keunggulanVisualFile, setUploadingKeunggulanVisual, setKeunggulanVisualFile)}
                  className="btn btn-primary btn-sm w-full text-white"
                  disabled={uploadingKeunggulanVisual}
                >
                  {uploadingKeunggulanVisual && <span className="loading loading-spinner loading-xs"></span>}
                  Upload Visual Keunggulan
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Banner Hero</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center border border-base-300 relative">
                {form.banner_hero ? (
                  <img src={`http://localhost:8000/storage/${form.banner_hero}`} alt="Banner Hero" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-base-content/40">Belum ada Banner</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              {bannerFile && (
                <button
                  type="button"
                  onClick={() => handleUpload('banner_hero', bannerFile, setUploadingBanner, setBannerFile)}
                  className="btn btn-primary btn-sm w-full text-white"
                  disabled={uploadingBanner}
                >
                  {uploadingBanner && <span className="loading loading-spinner loading-xs"></span>}
                  Upload Banner
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Informasi Umum</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Nama Perusahaan</span></label>
                  <input type="text" name="nama_perusahaan" className="input input-sm input-bordered" value={form.nama_perusahaan} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Email Instansi</span></label>
                  <input type="email" name="email_perusahaan" className="input input-sm input-bordered" value={form.email_perusahaan} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">No. Telepon / WA</span></label>
                  <input type="text" name="no_telp" className="input input-sm input-bordered" value={form.no_telp} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Alamat</span></label>
                  <input type="text" name="alamat" className="input input-sm input-bordered" value={form.alamat} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Hero Section</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Hero Tagline</span></label>
                  <input type="text" name="hero_tagline" className="input input-sm input-bordered" value={form.hero_tagline} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Hero Title</span></label>
                  <input type="text" name="hero_title" className="input input-sm input-bordered" value={form.hero_title} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Sejarah, Visi, Misi</h2>
              <div className="form-control">
                <label className="label"><span className="label-text">Sejarah Perusahaan</span></label>
                <textarea name="sejarah_perusahaan" className="textarea textarea-bordered h-24" value={form.sejarah_perusahaan} onChange={handleChange} required></textarea>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Visi & Misi</span></label>
                <textarea name="visi_misi" className="textarea textarea-bordered h-24" value={form.visi_misi} onChange={handleChange} required></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">Statistik</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Tahun Berdiri</span></label>
                  <input type="number" name="tahun_berdiri" className="input input-sm input-bordered" value={form.tahun_berdiri} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Jumlah Klien</span></label>
                  <input type="number" name="jumlah_klien" className="input input-sm input-bordered" value={form.jumlah_klien} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Jumlah Proyek</span></label>
                  <input type="number" name="jumlah_proyek" className="input input-sm input-bordered" value={form.jumlah_proyek} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-md font-bold text-secondary border-b border-base-200 pb-2">3 Keunggulan Utama</h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text">Keunggulan 1</span></label>
                  <input type="text" name="keunggulan_1" className="input input-sm input-bordered" value={form.keunggulan_1} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Keunggulan 2</span></label>
                  <input type="text" name="keunggulan_2" className="input input-sm input-bordered" value={form.keunggulan_2} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Keunggulan 3</span></label>
                  <input type="text" name="keunggulan_3" className="input input-sm input-bordered" value={form.keunggulan_3} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-base-200 flex justify-end">
              <button type="submit" className="btn btn-primary btn-sm text-white" disabled={saving}>
                {saving && <span className="loading loading-spinner loading-xs"></span>}
                Simpan Perubahan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}