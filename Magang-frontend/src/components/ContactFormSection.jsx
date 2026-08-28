import { useState } from 'react'
import api from '../api/axios'

export default function ContactFormSection({ settings }) {
  const [contactForm, setContactForm] = useState({ nama: '', email: '', no_hp: '', subjek: 'Konsultasi dari Homepage', pesan: '' })
  const [contactSuccess, setContactSuccess] = useState('')
  const [contactErrors, setContactErrors] = useState({})
  const [sendingContact, setSendingContact] = useState(false)

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSuccess('')
    setContactErrors({})
    setSendingContact(true)
    
    try {
      await api.post('/public/kontak', {
        ...contactForm,
        subjek: contactForm.subjek || 'Konsultasi',
        no_hp: contactForm.no_hp || '-'
      })
      setContactSuccess('Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.')
      setContactForm({ nama: '', email: '', no_hp: '', subjek: 'Konsultasi dari Homepage', pesan: '' })
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT: Text & Bullets */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase block">Mulai</span>
            <h2 className="text-4xl sm:text-5xl font-black text-secondary leading-tight tracking-tight">
              Diskusikan <span className="text-base-content/40">proyek Anda.</span>
            </h2>
            <p className="text-base text-base-content/70">
              Ceritakan kebutuhan Anda - kami bantu petakan scope dan timeline.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Bullet 1 */}
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Konsultasi pertama</h4>
                <p className="text-xs text-base-content/60 mt-1">Gratis, tanpa kewajiban</p>
              </div>
            </div>
            
            {/* Bullet 2 */}
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Estimasi 24 jam</h4>
                <p className="text-xs text-base-content/60 mt-1">Proposal teknis dan timeline</p>
              </div>
            </div>

            {/* Bullet 3 */}
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Tim berpengalaman</h4>
                <p className="text-xs text-base-content/60 mt-1">5+ tahun di industri digital</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Contact Message Form */}
        <div className="lg:col-span-6">
          <div className="card bg-base-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-base-200/80 p-6 sm:p-10 rounded-3xl">
            {contactSuccess && (
              <div className="alert alert-success mb-6 rounded-xl flex items-start gap-2 shadow-sm text-sm border-0 bg-green-500/10 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{contactSuccess}</span>
              </div>
            )}

            {contactErrors.global && (
              <div className="alert alert-error mb-6 rounded-xl flex items-start gap-2 shadow-sm text-sm border-0 bg-red-500/10 text-red-700">
                <span>{contactErrors.global}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div className="form-control">
                <label className="label px-0 py-1.5"><span className="text-xs font-semibold text-secondary/70">Nama Anda</span></label>
                <input
                  type="text"
                  className={`input input-bordered border border-base-300 bg-base-50 focus:bg-base-100 focus:border-primary/50 w-full text-sm rounded-xl ${contactErrors.nama ? 'input-error' : ''}`}
                  value={contactForm.nama}
                  onChange={(e) => setContactForm({ ...contactForm, nama: e.target.value })}
                  placeholder="Nama Anda"
                  required
                />
                {contactErrors.nama && <span className="text-error text-xs mt-1">{contactErrors.nama[0]}</span>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label px-0 py-1.5"><span className="text-xs font-semibold text-secondary/70">Email</span></label>
                <input
                  type="email"
                  className={`input input-bordered border border-base-300 bg-base-50 focus:bg-base-100 focus:border-primary/50 w-full text-sm rounded-xl ${contactErrors.email ? 'input-error' : ''}`}
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="nama@email.com"
                  required
                />
                {contactErrors.email && <span className="text-error text-xs mt-1">{contactErrors.email[0]}</span>}
              </div>

              {/* Pesan */}
              <div className="form-control">
                <label className="label px-0 py-1.5"><span className="text-xs font-semibold text-secondary/70">Kebutuhan singkat</span></label>
                <textarea
                  className={`textarea textarea-bordered border border-base-300 bg-base-50 focus:bg-base-100 focus:border-primary/50 h-28 w-full text-sm rounded-xl leading-relaxed ${contactErrors.pesan ? 'textarea-error' : ''}`}
                  value={contactForm.pesan}
                  onChange={(e) => setContactForm({ ...contactForm, pesan: e.target.value })}
                  placeholder="Saya butuh web app untuk... / EA untuk strategi..."
                  required
                />
                {contactErrors.pesan && <span className="text-error text-xs mt-1">{contactErrors.pesan[0]}</span>}
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full text-white font-bold text-sm rounded-full h-12 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all normal-case"
                  disabled={sendingContact}
                >
                  {sendingContact ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      Kirim Pesan
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center pt-3">
                <p className="text-[10px] text-base-content/40">
                  Form ini dilindungi reCAPTCHA. Berlaku <a href="#" className="underline hover:text-primary">Kebijakan Privasi</a> - <a href="#" className="underline hover:text-primary">Ketentuan Layanan</a>.
                </p>
                <p className="text-[11px] text-base-content/60 mt-3 font-medium">
                  Atau <a href="/kontak" className="underline hover:text-primary decoration-primary/50 underline-offset-2">isi form lengkap</a> untuk proyek yang lebih kompleks.
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}
