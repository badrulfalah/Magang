import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function About() {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem("kurva_site_settings")
      return cached ? JSON.parse(cached) : {}
    } catch {
      return {}
    }
  })
  const [team, setTeam] = useState([])

  useEffect(() => {
    api.get('/public/pengaturan')
      .then(res => {
        const data = res.data || {}
        const realSettings = data.settings || data
        setSettings(realSettings)
        localStorage.setItem("kurva_site_settings", JSON.stringify(realSettings))
      })
      .catch(err => console.error(err))

    api.get('/public/anggota-tim')
      .then(res => {
        setTeam(res.data || [])
      })
      .catch(err => console.error(err))
  }, [])

  const bgUrl = settings.bg_about ? `http://localhost:8000/storage/${settings.bg_about}` : ''

  return (
    <div className="space-y-24 pb-24 bg-base-100/50">
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
            
            {/* Left Column - Headline & Description */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-accent border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Tentang Kami
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
                Membangun Masa Depan Digital yang <span className="text-accent">Andal & Tumbuh</span> Bersama Mitra
              </h1>
              <p className="text-lg text-secondary-content/80 leading-relaxed">
                Kami berkomitmen menjadi mitra transformasi bisnis terbaik melalui teknologi informasi yang bersih, disiplin, inovatif, dan tepat sasaran.
              </p>
            </div>
            
            <div className="hidden lg:block lg:col-span-5" />

          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1" style={{ animation: 'aboutFadeUp 1.2s ease-out 0.5s both' }}>
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Gulir ke Bawah</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: 'aboutBounce 2s ease-in-out infinite' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <style>{`
          @keyframes aboutFadeUp {
            0% { opacity: 0; transform: translate(-50%, 20px); }
            100% { opacity: 1; transform: translate(-50%, 0); }
          }
          @keyframes aboutBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════ CORE VALUES SECTION ══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block">
            Karakter & Nilai
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary tracking-tight leading-[1.1]">
            Kenapa <span className="text-secondary/45 font-normal">Memilih Kami?</span>
          </h2>
          <p className="text-base-content/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Kami menjunjung tinggi standar profesionalisme untuk memberikan hasil terbaik bagi bisnis Anda.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Inovasi Berkelanjutan",
              desc: "Selalu mengeksplorasi teknologi terbaru untuk memberikan solusi modern yang relevan.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )
            },
            {
              title: "Kode Kualitas Tinggi",
              desc: "Kode program yang rapi, terstruktur, standar industri, serta mudah dipelihara jangka panjang.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              )
            },
            {
              title: "Disiplin & Transparan",
              desc: "Laporan perkembangan berkala dan pengerjaan tepat waktu sesuai dengan target timeline.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )
            },
            {
              title: "Kemitraan Jangka Panjang",
              desc: "Kami tidak hanya membangun, tapi juga mendukung pemeliharaan sistem agar tetap optimal.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            }
          ].map((val, idx) => (
            <div key={idx} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="card-body p-6 space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                  {val.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg text-secondary group-hover:text-primary transition-colors duration-200">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════ HISTORY & VISION-MISSION SECTION ══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Sejarah */}
          <div className="card bg-base-100 border border-base-200 shadow-sm p-8 sm:p-10 space-y-6 flex flex-col justify-between relative overflow-hidden rounded-3xl group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />
            <div className="space-y-4 relative text-left">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Sejarah Perusahaan</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary tracking-tight leading-[1.1]">
                  Sejarah <span className="text-secondary/45 font-normal">Perusahaan</span>
                </h2>
              </div>
              <p className="text-base-content/75 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {settings.sejarah_perusahaan || 'Didirikan dengan mimpi besar, kami berkomitmen menjadi mitra transformasi bisnis terbaik melalui teknologi informasi yang bersih, disiplin, dan tepat sasaran.'}
              </p>
            </div>
          </div>

          {/* Visi Misi */}
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/15 p-8 sm:p-10 space-y-6 rounded-3xl relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-300" />
            <div className="space-y-4 relative text-left">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Visi & Misi</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary tracking-tight leading-[1.1]">
                  Visi <span className="text-secondary/45 font-normal">& Misi</span>
                </h2>
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-base-content/85">
                {settings.visi_misi ? (
                  <p className="whitespace-pre-line">{settings.visi_misi}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="font-bold text-secondary text-base">Visi Kami</p>
                      <p className="text-base-content/75 pl-4 border-l-2 border-primary/30 text-sm sm:text-base">
                        Menjadi agensi digital terpercaya di tingkat nasional yang menghasilkan solusi teknologi andal, bersih, dan berorientasi jangka panjang.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-secondary text-base">Misi Kami</p>
                      <ul className="list-disc pl-5 space-y-1 text-base-content/75 text-sm sm:text-base">
                        <li>Menyediakan kode pemrograman berkualitas tinggi yang terstruktur dan mudah dirawat.</li>
                        <li>Menerapkan pengerjaan teratur dengan transparansi penuh kepada mitra bisnis.</li>
                        <li>Memberikan pemeliharaan dan dukungan berkelanjutan demi kestabilan sistem klien.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════ TEAM SECTION ══════════════════════════════ */}
      {team.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary block">
              Kolaborator Hebat
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-secondary tracking-tight leading-[1.1]">
              Tim <span className="text-secondary/45 font-normal">Kami</span>
            </h2>
            <p className="text-base-content/60 text-sm max-w-md mx-auto leading-relaxed">
              Bertemu dengan talenta profesional di balik kesuksesan setiap proyek teknologi Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div key={member.id_anggota} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center group rounded-2xl p-6">
                
                {/* Simple Circular Photo / Initial Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-base-200 ring-4 ring-primary/5 group-hover:ring-primary/20 transition-all duration-300 shrink-0">
                    {member.foto ? (
                      <img 
                        src={`http://localhost:8000/storage/${member.foto}`} 
                        alt={member.nama} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-out" 
                        loading="lazy"
                        width="112"
                        height="112"
                      />
                    ) : (
                      <div className="w-full h-full relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0F4A3D 0%, #196B58 50%, #2A9D78 100%)'}}>
                        {/* Decorative accent */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full opacity-20" style={{background:'#C4F135'}} />
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-10" style={{background:'white'}} />
                        {/* Proper person silhouette */}
                        <svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          {/* Head */}
                          <circle cx="60" cy="42" r="20" fill="white" fillOpacity="0.9"/>
                          {/* Shoulders / chest arc — classic profile shape */}
                          <path d="M0 120 C0 80 20 68 60 68 C100 68 120 80 120 120 Z" fill="white" fillOpacity="0.8"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base sm:text-lg text-secondary group-hover:text-primary transition-colors duration-200">
                      {member.nama}
                    </h3>
                    <p className="text-xs text-base-content/50 uppercase tracking-widest font-semibold">
                      {member.jabatan}
                    </p>
                  </div>
                  
                  <div className="w-8 h-0.5 bg-primary/20 mx-auto group-hover:w-12 transition-all duration-300" />
                  
                  {/* Premium Social Links Placeholder */}
                  <div className="flex items-center justify-center gap-3 text-base-content/30 group-hover:text-primary/70 transition-all duration-300">
                    <a href="#linkedin" className="hover:text-primary transition-colors duration-200 hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#github" className="hover:text-primary transition-colors duration-200 hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="#email" className="hover:text-primary transition-colors duration-200 hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════ CTA SECTION ══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-secondary to-primary text-white p-8 sm:p-12 shadow-xl border border-primary/20">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#1f6f54_25%,transparent_25%),linear-gradient(-45deg,#1f6f54_25%,transparent_25%)] bg-[size:30px_30px]" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 md:flex md:items-center md:justify-between gap-8 text-center md:text-left space-y-6 md:space-y-0">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Siap Mewujudkan Ide Digital Anda?</h2>
              <p className="text-secondary-content/85 text-sm sm:text-base max-w-xl">
                Diskusikan proyek Anda dengan tim ahli kami untuk mendapatkan analisis dan solusi teknologi terbaik.
              </p>
            </div>
            <div className="shrink-0 flex justify-center">
              <Link 
                to="/kontak" 
                className="btn btn-primary border-none btn-md text-white font-bold hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-primary/25 gap-2 px-6"
              >
                Hubungi Kami Sekarang
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}