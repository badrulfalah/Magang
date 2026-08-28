import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'

export default function Contact() {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem("kurva_site_settings")
      return cached ? JSON.parse(cached) : {}
    } catch {
      return {}
    }
  })
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  const [contactForm, setContactForm] = useState({ nama: '', email: '', no_hp: '', subjek: '', pesan: '' })
  const [contactSuccess, setContactSuccess] = useState('')
  const [contactErrors, setContactErrors] = useState({})
  const [sendingContact, setSendingContact] = useState(false)

  const faqSectionRef = useRef(null)

  useEffect(() => {
    api.get('/public/pengaturan')
      .then(res => {
        const data = res.data || {}
        const realSettings = data.settings || data
        setSettings(realSettings)
        localStorage.setItem("kurva_site_settings", JSON.stringify(realSettings))
      })
      .catch(err => console.error(err))

    api.get('/public/faq')
      .then(res => {
        setFaqs(res.data || [])
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSuccess('')
    setContactErrors({})
    setSendingContact(true)
    try {
      await api.post('/public/kontak', contactForm)
      setContactSuccess('Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.')
      setContactForm({ nama: '', email: '', no_hp: '', subjek: '', pesan: '' })
    } catch (err) {
      if (err.response?.status === 422) {
        setContactErrors(err.response.data.errors || {})
      } else {
        setContactErrors({ global: 'Gagal mengirim pesan. Silakan coba kembali.' })
      }
    } finally {
      setSendingContact(false)
    }
  }

  const scrollToFaq = () => {
    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const waNumber = (settings.no_telp || "081234567890").replace(/\D/g, "")
  const waLink = `https://wa.me/62${waNumber.startsWith("0") ? waNumber.slice(1) : waNumber}`
  const waMsg = encodeURIComponent("Halo Kurva, saya ingin berkonsultasi mengenai proyek saya.")

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  const bgUrl = settings.bg_contact ? `http://localhost:8000/storage/${settings.bg_contact}` : ''

  return (
    <div className="bg-base-50 min-h-screen space-y-16 pb-24">
      {/* ══════════════════════════════ HERO SECTION ══════════════════════════════ */}
      <section 
        className="relative overflow-hidden bg-secondary text-secondary-content py-20 sm:py-24 min-h-[380px] sm:min-h-[450px] flex items-center"
        style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {!bgUrl && (
          <>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#1f6f54_25%,transparent_25%),linear-gradient(-45deg,#1f6f54_25%,transparent_25%)] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          </>
        )}
        
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Left side text */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-accent border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Hubungi Kami Kapan Saja
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
                Diskusi proyek <span className="text-accent">Anda.</span>
              </h1>
              <p className="text-lg text-secondary-content/80 leading-relaxed">
                Konsultasi teknis atau pertanyaan mengenai layanan pengembangan sistem kami. Balasan maksimal dalam 24 jam kerja.
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2.5 pt-2 justify-center lg:justify-start">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  10+ Layanan Tersedia
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  3 Channel Utama
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Respon &lt; 24 Jam Kerja
                </span>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5" />

          </div>
        </div>
      </section>

      {/* ══════════════════════════════ GRID CONTENT ══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT: Contact Info with social media */}
          <div className="md:col-span-5 lg:col-span-5 space-y-5">
            <div className="card bg-base-100 border-2 border-base-200 shadow-sm p-5 sm:p-6 space-y-5 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase block mb-1">Hubungi Kami</span>
                <h2 className="text-2xl font-black text-secondary">Informasi Kontak</h2>
                <p className="text-xs text-base-content/50 mt-1">Gunakan salah satu kontak di bawah untuk konsultasi langsung.</p>
              </div>

              {/* Info Items */}
              <div className="space-y-4">
                {/* Email Box */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-base-200 bg-base-50/50 hover:border-primary/40 hover:bg-base-100 transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-base-content/40 tracking-wider uppercase block">Email Resmi</span>
                    <a href={`mailto:${settings.email_perusahaan || 'info@kurvamedia.id'}`} className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                      {settings.email_perusahaan || 'info@kurvamedia.id'}
                    </a>
                  </div>
                </div>

                {/* Telepon Box */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-base-200 bg-base-50/50 hover:border-primary/40 hover:bg-base-100 transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-base-content/40 tracking-wider uppercase block">Telepon</span>
                    <span className="text-sm font-bold text-secondary">
                      {settings.no_telp || '081234567890'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Box */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-base-200 bg-base-50/50 hover:border-primary/40 hover:bg-base-100 transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.479 1.332 4.99L2 22l5.166-1.353c1.47.8 3.125 1.22 4.846 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm4.887 13.9c-.2.56-1.18 1.09-1.63 1.13-.45.04-.89.21-2.9-0.59-2.57-1.02-4.22-3.63-4.35-3.8-0.13-.17-1.03-1.37-1.03-2.61s.65-1.85.88-2.09c.23-.24.5-.3.67-.3h.48c.15 0 .36.01.52.39.17.41.59 1.45.64 1.56.05.1.08.23.01.37s-.1.22-.2.35c-.1.13-.21.29-.3.40-.1.11-.21.23-.09.43.12.2.53.88 1.14 1.43.79.71 1.45.93 1.66 1.02.21.09.33.08.45-.06.12-.14.52-.6.66-.81.14-.21.28-.17.47-.1.19.07 1.22.58 1.43.68.21.1.35.15.4.24.05.09.05.53-.15 1.09z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-base-content/40 tracking-wider uppercase block">WhatsApp</span>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-secondary hover:text-green-500 transition-colors">
                      {settings.no_telp || '081234567890'}
                    </a>
                  </div>
                </div>

                {/* Alamat Box */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-base-200 bg-base-50/50 hover:border-primary/40 hover:bg-base-100 transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-base-content/40 tracking-wider uppercase block">Kantor Utama</span>
                    <span className="text-sm font-bold text-secondary leading-relaxed block">
                      {settings.alamat || 'Yogyakarta, Indonesia'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Link badges */}
              <div className="pt-4 border-t border-base-200">
                <span className="text-[10px] font-bold text-base-content/40 tracking-wider uppercase block mb-3">Ikuti Media Sosial</span>
                <div className="flex flex-wrap gap-2">
                  <a href={settings.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="badge badge-outline border-base-300 hover:border-pink-500 hover:text-pink-500 py-3 px-3 gap-1.5 cursor-pointer text-xs font-semibold flex items-center">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                  <a href={settings.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="badge badge-outline border-base-300 hover:border-blue-600 hover:text-blue-600 py-3 px-3 gap-1.5 cursor-pointer text-xs font-semibold flex items-center">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="badge badge-outline border-base-300 hover:border-green-500 hover:text-green-500 py-3 px-3 gap-1.5 cursor-pointer text-xs font-semibold flex items-center">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.479 1.332 4.99L2 22l5.166-1.353c1.47.8 3.125 1.22 4.846 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm4.887 13.9c-.2.56-1.18 1.09-1.63 1.13-.45.04-.89.21-2.9-0.59-2.57-1.02-4.22-3.63-4.35-3.8-0.13-.17-1.03-1.37-1.03-2.61s.65-1.85.88-2.09c.23-.24.5-.3.67-.3h.48c.15 0 .36.01.52.39.17.41.59 1.45.64 1.56.05.1.08.23.01.37s-.1.22-.2.35c-.1.13-.21.29-.3.40-.1.11-.21.23-.09.43.12.2.53.88 1.14 1.43.79.71 1.45.93 1.66 1.02.21.09.33.08.45-.06.12-.14.52-.6.66-.81.14-.21.28-.17.47-.1.19.07 1.22.58 1.43.68.21.1.35.15.4.24.05.09.05.53-.15 1.09z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a href="https://t.me/kurvamedia" target="_blank" rel="noopener noreferrer" className="badge badge-outline border-base-300 hover:border-sky-500 hover:text-sky-500 py-3 px-3 gap-1.5 cursor-pointer text-xs font-semibold flex items-center">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.914-.962 5.584-1.359 7.712-.168.9-.499 1.201-.82 1.231-.697.064-1.226-.461-1.901-.903-1.057-.692-1.653-1.122-2.68-1.799-1.186-.782-.417-1.214.259-1.916.177-.183 3.247-2.977 3.307-3.232.007-.032.014-.15-.056-.212-.07-.062-.173-.04-.247-.024-.105.023-1.782 1.134-5.028 3.328-.476.327-.882.487-1.22.48-.372-.008-1.087-.21-1.619-.383-.652-.213-1.17-.326-1.125-.688.023-.189.284-.382.784-.579 3.09-1.346 5.151-2.235 6.182-2.666 2.937-1.229 3.547-1.443 3.945-1.45.088-.002.285.02.412.122.107.086.137.202.147.284.01.077.022.253.012.391z"/>
                    </svg>
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Message Form */}
          <div className="md:col-span-7 lg:col-span-7">
            <div className="card bg-base-100 border-2 border-base-200 shadow-sm p-5 sm:p-6 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase block mb-1">Formulir Kontak</span>
                <h2 className="text-2xl font-black text-secondary">Kirim pesan Anda</h2>
                <p className="text-xs text-base-content/50 mt-1">Pesan Anda akan langsung diteruskan ke tim representatif kami.</p>
              </div>

              {contactSuccess && (
                <div className="alert alert-success mt-6 rounded-xl flex items-start gap-2 shadow-sm text-sm border-0 bg-green-500/10 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{contactSuccess}</span>
                </div>
              )}

              {contactErrors.global && (
                <div className="alert alert-error mt-6 rounded-xl flex items-start gap-2 shadow-sm text-sm border-0 bg-red-500/10 text-red-700">
                  <span>{contactErrors.global}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {/* Nama Lengkap */}
                <div className="form-control">
                  <label className="label py-0.5"><span className="text-xs font-bold text-secondary uppercase">Nama Lengkap <span className="text-primary">*</span></span></label>
                  <input
                    type="text"
                    className={`input input-sm input-bordered border border-base-300 focus:input-primary w-full text-sm rounded-xl ${contactErrors.nama ? 'input-error' : ''}`}
                    value={contactForm.nama}
                    onChange={(e) => setContactForm({ ...contactForm, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap Anda"
                    required
                  />
                  {contactErrors.nama && <span className="text-error text-xs mt-1">{contactErrors.nama[0]}</span>}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label py-0.5"><span className="text-xs font-bold text-secondary uppercase">Email <span className="text-primary">*</span></span></label>
                  <input
                    type="email"
                    className={`input input-sm input-bordered border border-base-300 focus:input-primary w-full text-sm rounded-xl ${contactErrors.email ? 'input-error' : ''}`}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="nama@email.com"
                    required
                  />
                  {contactErrors.email && <span className="text-error text-xs mt-1">{contactErrors.email[0]}</span>}
                </div>

                {/* Telepon / WA */}
                <div className="form-control">
                  <label className="label py-0.5"><span className="text-xs font-bold text-secondary uppercase">Telepon / WhatsApp <span className="text-primary">*</span></span></label>
                  <input
                    type="text"
                    className={`input input-sm input-bordered border border-base-300 focus:input-primary w-full text-sm rounded-xl ${contactErrors.no_hp ? 'input-error' : ''}`}
                    value={contactForm.no_hp}
                    onChange={(e) => setContactForm({ ...contactForm, no_hp: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    required
                  />
                  {contactErrors.no_hp && <span className="text-error text-xs mt-1">{contactErrors.no_hp[0]}</span>}
                </div>

                {/* Layanan yang Diminati / Subjek */}
                <div className="form-control">
                  <label className="label py-0.5"><span className="text-xs font-bold text-secondary uppercase">Layanan yang Diminati <span className="text-primary">*</span></span></label>
                  <select
                    className="select select-sm select-bordered focus:select-primary w-full text-sm rounded-xl font-medium"
                    value={contactForm.subjek}
                    onChange={(e) => setContactForm({ ...contactForm, subjek: e.target.value })}
                    required
                  >
                    <option value="" disabled>Pilih Layanan</option>
                    <option value="Web Development">Web Development (Website, Portal, SaaS)</option>
                    <option value="Mobile App Development">Mobile App Development (Android & iOS)</option>
                    <option value="Software Maintenance">Sistem Custom & Maintenance</option>
                    <option value="Consultation">Konsultasi Bisnis Lainnya</option>
                  </select>
                  {contactErrors.subjek && <span className="text-error text-xs mt-1">{contactErrors.subjek[0]}</span>}
                </div>

                {/* Pesan */}
                <div className="form-control md:col-span-2">
                  <label className="label py-0.5"><span className="text-xs font-bold text-secondary uppercase">Pesan Anda <span className="text-primary">*</span></span></label>
                  <textarea
                    className={`textarea textarea-bordered focus:textarea-primary h-24 w-full text-sm rounded-xl leading-relaxed ${contactErrors.pesan ? 'textarea-error' : ''}`}
                    value={contactForm.pesan}
                    onChange={(e) => setContactForm({ ...contactForm, pesan: e.target.value })}
                    placeholder="Jelaskan secara singkat mengenai kebutuhan sistem atau pertanyaan Anda..."
                    required
                  />
                  {contactErrors.pesan && <span className="text-error text-xs mt-1">{contactErrors.pesan[0]}</span>}
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 pt-1">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-sm h-10 w-full md:w-auto text-white px-8 rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all normal-case font-bold"
                    disabled={sendingContact}
                  >
                    <span>Kirim Pesan</span>
                    {sendingContact ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════ COMMITMENT & FAQ REDIRECT ══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Commitment Card */}
          <div className="card bg-base-100 border-2 border-base-200 shadow-md p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Komitmen Kami</span>
              <h3 className="text-2xl font-black text-secondary leading-tight">Proses yang jelas</h3>
              
              <ul className="space-y-4.5 pt-2">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-base-content/75 font-medium">Balasan konsultasi maksimal 24 jam kerja.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.9C2.044 5.378 2 5.88 2 6.4c0 4.887 3.513 9.52 9.48 11.442a1.002 1.002 0 00.672 0C18.12 15.92 21.6 11.288 21.6 6.4c0-.52-.044-1.02-.166-1.5C20.198 5.485 18.064 6 15.75 6 12.35 6 9.479 4.773 7.25 2.766a1.003 1.003 0 00-1.34 0C3.682 4.773.81 6-.03 6 .802 6.002 2.166 4.9 2.166 4.9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-base-content/75 font-medium">Data formulir Anda dijamin aman & hanya digunakan untuk menindaklanjuti inquiry.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <span className="text-sm text-base-content/75 font-medium">Konsultasi awal & estimasi biaya 100% gratis tanpa komitmen apa pun.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick FAQ / WhatsApp Redirection */}
          <div className="card bg-secondary text-secondary-content p-6 sm:p-8 rounded-2xl flex flex-col justify-between border-2 border-secondary">
            <div className="space-y-4">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Cek FAQ dulu</span>
              <h3 className="text-2xl font-black text-white leading-tight">Mungkin pertanyaan Anda sudah terjawab?</h3>
              <p className="text-sm text-secondary-content/75 leading-relaxed">
                Kami telah menyusun daftar pertanyaan paling umum mengenai harga, alur kerja, durasi pengerjaan, dan garansi pengembangan.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button 
                onClick={scrollToFaq}
                className="btn btn-primary border-none text-white font-bold flex-1 gap-2 flex items-center justify-center"
              >
                Lihat Daftar FAQ 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <a 
                href={`${waLink}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-green-500 hover:bg-green-400 text-white border-0 font-bold flex-1 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.249 8.477 3.518 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005 0-3.973-.502-5.717-1.464L0 24zm6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24z"/>
                </svg>
                Chat WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════ ACCORDION FAQ SECTION ══════════════════════════════ */}
      {faqs.length > 0 && (
        <section ref={faqSectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              FAQ
            </span>
            <h2 className="text-3xl font-black text-secondary">Frequently Asked Questions</h2>
            <p className="text-sm text-base-content/50 mt-1">Temukan jawaban cepat untuk pertanyaan umum di bawah.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id_faq} 
                className="collapse collapse-plus bg-base-100 border-2 border-base-200 shadow-sm rounded-2xl hover:border-primary/30 transition-colors"
              >
                <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                <div className="collapse-title text-base sm:text-lg font-bold text-secondary flex items-center pr-12">
                  {faq.pertanyaan}
                </div>
                <div className="collapse-content text-sm sm:text-base text-base-content/75 leading-relaxed whitespace-pre-line">
                  <div className="pt-3 border-t border-base-100 mt-2">
                    {faq.jawaban}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
