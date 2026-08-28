import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import api from '../../api/axios'

const FEATURE_COLORS = [
  { bg: 'bg-primary/5', border: 'border-primary/15', icon: 'bg-primary/10 text-primary', glow: 'from-primary/10' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200/60', icon: 'bg-emerald-100 text-emerald-600', glow: 'from-emerald-100' },
  { bg: 'bg-teal-50', border: 'border-teal-200/60', icon: 'bg-teal-100 text-teal-600', glow: 'from-teal-100' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200/60', icon: 'bg-cyan-100 text-cyan-600', glow: 'from-cyan-100' },
  { bg: 'bg-green-50', border: 'border-green-200/60', icon: 'bg-green-100 text-green-600', glow: 'from-green-100' },
]

function FeatureIcon({ text }) {
  const t = (text || '').toLowerCase()
  if (t.includes('real-time') || t.includes('monitoring') || t.includes('grafik'))
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  if (t.includes('notif') || t.includes('alarm') || t.includes('alert'))
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  if (t.includes('remote') || t.includes('kontrol') || t.includes('control') || t.includes('device'))
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
  if (t.includes('data') || t.includes('histori') || t.includes('analisis') || t.includes('laporan') || t.includes('ekspor'))
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  if (t.includes('manajemen') || t.includes('manage') || t.includes('perangkat') || t.includes('sistem'))
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
}

function parseFeatureBlocks(html) {
  if (!html) return []
  const div = document.createElement('div')
  div.innerHTML = html
  const features = []
  div.childNodes.forEach(node => {
    if (!node.textContent?.trim()) return
    const nodeName = node.nodeName
    if (nodeName === 'P' || nodeName === 'DIV') {
      const boldEl = node.querySelector('strong, b')
      if (boldEl) {
        const title = boldEl.textContent.trim().replace(/:$/, '')
        const cloned = node.cloneNode(true)
        cloned.querySelector('strong, b')?.remove()
        const desc = cloned.textContent.trim().replace(/^[:\s]+/, '')
        if (title && !title.toLowerCase().startsWith('fitur')) features.push({ title, desc })
        return
      }
      const text = node.textContent.trim()
      if (text && !text.toLowerCase().match(/^fitur utama/)) features.push({ title: '', desc: text })
    } else if (['UL', 'OL'].includes(nodeName)) {
      node.querySelectorAll('li').forEach(li => {
        const s = li.querySelector('strong, b')
        if (s) {
          const t = s.textContent.trim().replace(/:$/, '')
          const cloned = li.cloneNode(true)
          cloned.querySelector('strong, b')?.remove()
          const d = cloned.textContent.trim().replace(/^[:\s]+/, '')
          features.push({ title: t, desc: d })
        } else {
          features.push({ title: '', desc: li.textContent.trim() })
        }
      })
    }
  })
  return features.filter(f => f.title || f.desc)
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startingChat, setStartingChat] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    api.get(`/public/produk/${slug}`)
      .then(res => {
        setProduct(res.data)
      })
      .catch(err => {
        console.error('Gagal memuat detail produk:', err)
        setErrorMsg('Produk tidak ditemukan atau telah dinonaktifkan.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  const handleTanyaMarketing = async () => {
    if (!user) {
      // Belum login, arahkan ke login dengan state info
      navigate('/login', {
        state: {
          from: location.pathname,
          alert: 'Silakan masuk atau daftar akun terlebih dahulu untuk mendapatkan penawaran terbaik dan berkonsultasi dengan tim Marketing.'
        }
      })
      return
    }

    setStartingChat(true)
    try {
      // Hubungi API untuk membuat/membuka sesi chat produk ini
      const res = await api.post('/chats', {
        product_id: product.id_produk
      })
      // Sesi chat didapatkan, redirect ke halaman Chat Center admin
      navigate('/admin/chat', {
        state: {
          activeChatId: res.data.id
        }
      })
    } catch (err) {
      console.error('Gagal memulai obrolan:', err)
      alert('Gagal memulai obrolan dengan marketing. Silakan coba beberapa saat lagi.')
    } finally {
      setStartingChat(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (errorMsg || !product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 px-4">
        <div className="text-error text-5xl">⚠️</div>
        <h2 className="text-2xl font-black text-secondary">Produk Tidak Ditemukan</h2>
        <p className="text-base-content/60 text-sm">{errorMsg || 'Maaf, produk yang Anda cari tidak tersedia.'}</p>
        <button onClick={() => navigate('/produk')} className="btn btn-primary btn-sm rounded-xl">Kembali ke Produk</button>
      </div>
    )
  }

  const parseSpesifikasi = (specStr) => {
    if (!specStr) return []
    return specStr.split('\n').map(line => {
      const idx = line.indexOf(':')
      if (idx !== -1) {
        const label = line.substring(0, idx).trim()
        const value = line.substring(idx + 1).trim()
        return { label, value, hasColon: true }
      }
      return { label: '', value: line.trim(), hasColon: false }
    }).filter(s => s.value)
  }

  const specs = parseSpesifikasi(product.spesifikasi)
  const features = parseFeatureBlocks(product.deskripsi)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* ── BACK BUTTON ── */}
      <div>
        <button
          onClick={() => navigate('/produk')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/50 hover:text-primary transition-all duration-200 hover:-translate-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Produk
        </button>
      </div>

      {/* ── PRODUCT TITLE HEADER ── */}
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold" style={{backgroundColor:'#C4F135', color:'#0F4A3D'}}>
          Ready System
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary leading-tight tracking-tight max-w-3xl">
          {product.nama}
        </h1>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Cover image — inside column, auto-fits photo */}
          <div className="relative group rounded-2xl overflow-hidden border border-primary/10 shadow-lg">
            {product.foto_sampul ? (
              <img
                src={`http://localhost:8000/storage/${product.foto_sampul}`}
                alt={product.nama}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700 rounded-2xl"
              />
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center text-white bg-gradient-to-br from-secondary via-[#196B58] to-primary relative overflow-hidden rounded-2xl">
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-60 text-accent mb-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-white/70 relative z-10">Premium Ready System</span>
              </div>
            )}
          </div>

          {/* ── LEAD DESCRIPTION ── */}
          {product.deskripsi_singkat && (
            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 via-white to-white p-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
              <div className="flex gap-4 items-start pl-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Deskripsi Produk</span>
                  <p className="text-base text-base-content/80 leading-relaxed font-medium">
                    {product.deskripsi_singkat}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── FEATURE CARDS ── */}
          {features.length > 0 ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-secondary">Fitur Unggulan</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat, i) => {
                  const c = FEATURE_COLORS[i % FEATURE_COLORS.length]
                  return (
                    <div
                      key={i}
                      className={`relative overflow-hidden rounded-2xl border p-5 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${c.border}`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-40 bg-gradient-to-br ${c.glow} to-transparent`} />
                      {feat.title ? (
                        <>
                          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 ${c.icon}`}>
                            <FeatureIcon text={feat.title} />
                          </div>
                          <h3 className="font-black text-sm text-secondary leading-snug mb-1.5">
                            {feat.title}
                          </h3>
                          {feat.desc && (
                            <p className="text-xs text-base-content/60 leading-relaxed">{feat.desc}</p>
                          )}
                        </>
                      ) : (
                        <div className="flex gap-3 items-start">
                          <div className={`mt-0.5 shrink-0 ${c.icon.split(' ')[1]}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-xs text-base-content/70 leading-relaxed">{feat.desc}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : product.deskripsi ? (
            <div className="bg-white border border-primary/5 shadow-sm p-6 sm:p-10 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-secondary">Fitur Unggulan</h2>
              </div>
              <div
                className="prose prose-sm max-w-none text-base-content/80 prose-headings:text-secondary prose-headings:font-black prose-strong:text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.deskripsi }}
              />
            </div>
          ) : null}
        </div>

        {/* ── RIGHT COLUMN: SPECIFICATIONS & CTA ── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Specifications Box */}
          {specs.length > 0 && (
            <div className="bg-white border border-primary/5 p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-base font-black text-secondary border-b border-base-200 pb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Spesifikasi Teknis
              </h3>
              <div className="space-y-2">
                {specs.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-4 rounded-2xl bg-base-100/60 border border-primary/5 hover:border-primary/15 transition-colors">
                    {s.hasColon ? (
                      <>
                        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40 shrink-0 mr-3">{s.label}</span>
                        <span className="text-xs font-bold text-secondary text-right">{s.value}</span>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-secondary">{s.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Penawaran Box */}
          <div className="relative overflow-hidden bg-gradient-to-br from-secondary via-[#0F4A3D] to-primary p-8 rounded-3xl text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-5 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-accent border border-white/20">
                Penawaran Terbaik
              </span>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Tertarik dengan<br/>Sistem ini?
              </h4>
              <p className="text-sm text-white/65 leading-relaxed max-w-[260px] mx-auto">
                Dapatkan proposal harga terbaik dan konsultasikan kebutuhan sistem Anda bersama tim kami.
              </p>

              <div className="pt-1">
                <button
                  onClick={handleTanyaMarketing}
                  disabled={startingChat}
                  className="btn w-full border-none font-black text-sm rounded-xl transition-all cursor-pointer"
                  style={{ backgroundColor: '#C4F135', color: '#0F4A3D', boxShadow: '0 8px 24px rgba(196,241,53,0.25)' }}
                >
                  {startingChat ? (
                    <span className="loading loading-spinner loading-sm" style={{color:'#0F4A3D'}}></span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Hubungi Tim Marketing
                    </>
                  )}
                </button>
                {!user && (
                  <p className="text-[10px] text-white/40 mt-3 font-light">
                    *Login terlebih dahulu untuk konsultasi privat
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
