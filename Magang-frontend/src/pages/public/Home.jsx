import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import api from "../../api/axios"
import ContactFormSection from "../../components/ContactFormSection"
import { serviceCategories as staticCategories } from "../../data/servicesData"
import { ServiceIcon } from "../../components/ServiceIcon"

// ── Tech Stack Marquee Data ──
const techStackRow1 = [
  { name: "GitLab", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
  { name: "Jenkins", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
  { name: "Terraform", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
  { name: "Ansible", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg" },
  { name: "Prometheus", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" },
  { name: "Grafana", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
  { name: "Laravel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
  { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
]

const techStackRow2 = [
  { name: "Ubuntu", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg" },
  { name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { name: "Nginx", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "iOS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" },
  { name: "Swift", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { name: "Kotlin", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  { name: "Android", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" },
  { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
]

// ── Star Rating ──
function StarRating({ rating }) {
  return (
    <div className="flex gap-1 text-[#FFB700]">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20"
          fill={s <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={s <= rating ? 0 : 1.5}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ── Counter Component for Stats ──
function StatCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          
          const isTimeFormat = target.includes('/')
          if (isTimeFormat) {
            setCount(target)
            return
          }

          const parsedTarget = parseInt(target, 10)
          if (isNaN(parsedTarget)) {
            setCount(target)
            return
          }

          const duration = 1500
          const startTime = performance.now()

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime
            const progress = Math.min(elapsedTime / duration, 1)
            const easeProgress = progress * (2 - progress)
            const currentVal = Math.floor(easeProgress * parsedTarget)

            setCount(currentVal)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(parsedTarget)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={elementRef} className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
      {count}{suffix}
    </span>
  )
}

// ── Testimonial Marquee ──
function TestimonialCarousel({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null

  const half = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, half)
  const row2 = testimonials.length > 1 ? testimonials.slice(half) : testimonials

  const repeatedRow1 = [...row1, ...row1, ...row1, ...row1]
  const repeatedRow2 = [...row2, ...row2, ...row2, ...row2]

  const TestimonialCard = ({ t }) => (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:border-primary/50 transition-colors duration-300 w-[380px] shrink-0 rounded-2xl">
      <div className="card-body p-6 space-y-3 flex flex-col h-full">
        <StarRating rating={t.rating} />
        <p className="text-[14.5px] text-base-content/80 leading-relaxed font-normal">"{t.isi_testimoni}"</p>
        <div className="flex items-center gap-3 pt-3 mt-auto">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {t.foto ? (
                <img src={`http://localhost:8000/storage/${t.foto}`} alt={t.nama_klien} className="object-cover w-full h-full" />
              ) : (
                t.nama_klien.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-secondary tracking-wide">{t.nama_klien}</h4>
            <p className="text-xs text-base-content/50 font-medium mt-0.5">{t.jabatan || 'Klien'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-base-100 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-base-100 to-transparent z-10" />

      <div className="flex flex-col gap-6">
        <div className="flex w-max animate-marquee-right gap-6" style={{ animationDuration: "60s" }}>
          {repeatedRow1.map((t, i) => (
            <TestimonialCard key={`r1-${t.id_testimoni}-${i}`} t={t} />
          ))}
        </div>

        <div className="flex w-max animate-marquee-left gap-6" style={{ animationDuration: "60s" }}>
          {repeatedRow2.map((t, i) => (
            <TestimonialCard key={`r2-${t.id_testimoni}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

const getProductCategory = (name) => {
  const n = name.toLowerCase();
  if (n.includes('iot') || n.includes('sensor') || n.includes('monitoring') || n.includes('dashboard')) return 'IoT & Hardware';
  if (n.includes('erp') || n.includes('resource') || n.includes('finance') || n.includes('invent')) return 'Enterprise System';
  if (n.includes('siakad') || n.includes('akademik') || n.includes('sekolah') || n.includes('kampus')) return 'Education Tech';
  return 'Sistem Terintegrasi';
}

export default function Home() {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem("kurva_site_settings")
      const parsed = cached ? JSON.parse(cached) : {}
      return {
        hero_title: "Simplifying Technology\nAmplifying Growth",
        hero_tagline: "Software house untuk web, mobile, IoT & Konsultan",
        sejarah_perusahaan: "Kami memberikan solusi digital terbaik untuk membantu bisnis Anda tumbuh dan bersaing di era digital.",
        ...parsed
      }
    } catch {
      return {
        hero_title: "Simplifying Technology\nAmplifying Growth",
        hero_tagline: "Software house untuk web, mobile, IoT & Konsultan",
        sejarah_perusahaan: "Kami memberikan solusi digital terbaik untuk membantu bisnis Anda tumbuh dan bersaing di era digital."
      }
    }
  })
  const [articles, setArticles] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [categories, setCategories] = useState(staticCategories)
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [keunggulans, setKeunggulans] = useState([])
  const [layananUnggulan, setLayananUnggulan] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/public/pengaturan").catch(() => ({ data: {} })),
      api.get("/public/artikel").catch(() => ({ data: { data: [] } })),
      api.get("/public/testimoni").catch(() => ({ data: [] })),
      api.get("/public/layanan").catch(() => ({ data: [] })),
      api.get("/public/produk").catch(() => ({ data: { data: [] } })),
      api.get("/public/clients").catch(() => ({ data: [] }))
    ])
      .then(([setRes, aRes, tRes, lRes, pRes, cRes]) => {
        // 1. Settings
        const data = setRes.data || {}
        setSettings(data.settings || data)
        if (data.keunggulans) {
          setKeunggulans(data.keunggulans)
        }
        if (data.layanan_unggulan) {
          const formatted = data.layanan_unggulan.map(lay => ({
            id: lay.id_layanan,
            judul: lay.title,
            deskripsi: lay.desc,
            kategori: lay.kategori_layanan?.name,
            slug: lay.kategori_layanan?.slug
          }));
          setLayananUnggulan(formatted)
        }
        localStorage.setItem("kurva_site_settings", JSON.stringify(data.settings || data))

        // 2. Others
        setArticles(aRes.data.data?.slice(0, 3) || [])
        setTestimonials(tRes.data || [])
        setProducts(pRes.data?.data?.slice(0, 3) || [])
        setClients(cRes.data || [])
        
        if (lRes.data && lRes.data.length > 0) {
          const mapped = lRes.data.map(cat => ({
            id: cat.id_kategori_layanan,
            slug: cat.slug,
            name: cat.name,
            subtitle: cat.subtitle,
            description: cat.description,
            iconId: cat.icon_id,
            items: (cat.layanan || []).map(item => ({
              id: item.id_layanan,
              num: item.num,
              title: item.title,
              badge: item.badge,
              desc: item.desc,
              tag: item.tag
            }))
          }))
          setCategories(mapped)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const waNumber = (settings.no_telp || "081234567890").replace(/\D/g, "")
  const waLink = `https://wa.me/62${waNumber.startsWith("0") ? waNumber.slice(1) : waNumber}`
  const waMsg = encodeURIComponent("Halo Kurva, saya tertarik untuk konsultasi proyek teknologi.")

  const half = Math.ceil(clients.length / 2)
  const row1 = clients.slice(0, half)
  const row2 = clients.length > 1 ? clients.slice(half) : []

  // Duplikasi visual tepat 1 kali agar loop marquee CSS tidak patah/jeda kosong
  const finalRow1 = row1.length > 0 ? [...row1, ...row1] : []
  const finalRow2 = row2.length > 0 ? [...row2, ...row2] : []

  return (
    <div className="space-y-12 pb-20">
      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0A2E26] flex items-center min-h-[calc(100vh-80px)] sm:min-h-[500px] lg:min-h-[560px] py-8 sm:py-0">
        {settings.banner_hero && (
          <img src={`http://localhost:8000/storage/${settings.banner_hero}`} alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover hidden lg:block" width="1280" height="480" fetchPriority="high" loading="eager" decoding="async" />
        )}
        {!settings.banner_hero && !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-base-content/30 border-4 border-dashed border-base-content/20 bg-base-200">
            <span className="text-xl sm:text-2xl font-bold bg-base-100/50 px-6 py-3 rounded-xl backdrop-blur-sm text-center">Banner Kosong<br/><span className="text-sm font-normal">Upload Foto Background Anda di Admin Panel</span></span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0 hidden lg:block"></div>
        <div className="absolute inset-0 bg-[#0A2E26]/90 z-0 lg:hidden"></div>

        {/* Floating Bubbles */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {[
            { size: 18, left: 8,  delay: 0,   dur: 7  },
            { size: 12, left: 18, delay: 1.5, dur: 9  },
            { size: 24, left: 30, delay: 0.5, dur: 8  },
            { size: 10, left: 42, delay: 3,   dur: 10 },
            { size: 20, left: 55, delay: 2,   dur: 7.5},
            { size: 14, left: 65, delay: 4,   dur: 9  },
            { size: 22, left: 75, delay: 1,   dur: 8.5},
            { size: 16, left: 85, delay: 2.5, dur: 7  },
            { size: 10, left: 92, delay: 3.5, dur: 10 },
            { size: 26, left: 50, delay: 0,   dur: 11 },
            { size: 8,  left: 12, delay: 5,   dur: 8  },
            { size: 15, left: 38, delay: 1.8, dur: 9.5},
          ].map((b, i) => (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-white/10 border border-white/20"
              style={{
                width: b.size,
                height: b.size,
                left: `${b.left}%`,
                bottom: '-30px',
                animation: `heroBubble ${b.dur}s ease-in infinite`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content — entrance animation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:block text-left md:max-w-2xl space-y-5 sm:space-y-6" style={{ animation: 'heroFadeUp 0.8s ease-out both' }}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary block leading-relaxed">
              {settings.hero_tagline || "Software house untuk web, mobile, IoT & Konsultan"}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-[3.4rem] font-bold tracking-[-0.035em] text-white leading-[1.2] sm:leading-[1.08] break-words">
              {settings.hero_title ? (
                settings.hero_title.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < settings.hero_title.split('\n').length - 1 && <br className="hidden sm:block" />}
                  </span>
                ))
              ) : (
                <>
                  Simplifying Technology<br className="hidden sm:block" />
                  Amplifying Growth
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-white/80 leading-relaxed max-w-xl font-light">
              {settings.sejarah_perusahaan || "Kami memberikan solusi digital terbaik untuk membantu bisnis Anda tumbuh dan bersaing di era digital."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <a
                href={`${waLink}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm sm:btn-md font-bold gap-2 bg-green-500 hover:bg-green-400 text-white border-0 shadow-lg shadow-green-500/20 rounded-full w-full sm:w-auto justify-center active:scale-95 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Hubungi WhatsApp</span>
              </a>
              <Link to="/layanan" className="btn btn-sm sm:btn-md font-bold gap-2 bg-neutral hover:bg-neutral/80 text-white border border-white/20 rounded-full w-full sm:w-auto justify-center active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Layanan &rarr;</span>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/70 mt-6 max-w-lg font-light">
              <span className="flex items-center gap-1.5 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Garansi 3 Bulan
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Respons Cepat
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                100% Klien Puas
              </span>
            </div>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="lg:hidden text-left space-y-5 flex flex-col items-start w-full relative z-10" style={{ animation: 'heroFadeUp 0.8s ease-out both' }}>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary block leading-relaxed">
              {settings.hero_tagline || "Software house untuk web, mobile, IoT & Konsultan"}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-[1.25] break-words w-full">
              {settings.hero_title ? (
                settings.hero_title.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < settings.hero_title.split('\n').length - 1 && <br />}
                  </span>
                ))
              ) : (
                <>
                  Simplifying Technology<br />
                  Amplifying Growth
                </>
              )}
            </h1>

            {/* Banner Foto Di Tengah (Tanpa ornamen melayang sama sekali, di-crop rapi sesuai screen) */}
            <div className="w-full relative py-2 overflow-hidden flex justify-center items-center">
              {settings.banner_hero ? (
                <div className="w-full relative h-[380px] sm:h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-lg">
                  <img 
                    src={`http://localhost:8000/storage/${settings.banner_hero}`} 
                    alt="Banner Hero" 
                    className="absolute h-[125%] w-auto max-w-none left-1/2 top-1/2 -translate-y-1/2 -translate-x-[74.5%] transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-xs text-white/40">
                  Banner Kosong
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light w-full">
              {settings.sejarah_perusahaan || "CV Kurva Media Teknologi bertekad memberikan solusi digital terbaik untuk transformasi bisnis modern."}
            </p>

            {/* Badge Trust (Garansi, Cepat, Puas) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] sm:text-xs text-white/60 font-light w-full pt-1.5 border-t border-white/5">
              <span className="flex items-center gap-1">
                ✓ Garansi 3 Bulan
              </span>
              <span className="flex items-center gap-1">
                ✓ Respons Cepat
              </span>
              <span className="flex items-center gap-1">
                ✓ 100% Klien Puas
              </span>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-2">
              <a
                href={`${waLink}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm font-bold gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white border-0 shadow-lg rounded-xl w-full justify-center py-2.5 h-auto text-xs active:scale-[0.98] transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Hubungi WhatsApp</span>
              </a>
              <Link to="/layanan" className="btn btn-sm font-bold gap-2 bg-[#3A3A3A] hover:bg-[#2F2F2F] text-white border border-white/10 rounded-xl w-full justify-center py-2.5 h-auto text-xs active:scale-[0.98] transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Layanan &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 hidden sm:flex" style={{ animation: 'heroFadeUp 1.2s ease-out 0.5s both' }}>
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Gulir ke Bawah</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════ CLIENTS PARTNER MARQUEE ══════════════════════════════ */}
      <section className="w-full relative pt-6 pb-0 overflow-hidden">
        <div className="text-center mb-6 px-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-base-content/40 block">
            Klien Terpercaya Kami
          </span>
        </div>
        {/* Marquee wrapper - full-width screen without max-w constraint */}
        <div className="relative w-full overflow-hidden py-4 bg-white border-y border-base-200 backdrop-blur-sm space-y-4 min-h-[110px]">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-base-100/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-base-100/80 to-transparent z-10" />
          
          {loading ? (
            <div className="flex gap-4 justify-center items-center py-2 overflow-hidden px-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-36 h-20 bg-slate-100 animate-pulse rounded-2xl shrink-0" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="flex justify-center items-center py-2 text-xs text-base-content/40 font-semibold uppercase tracking-wider">
              Menghubungkan klien & solusi digital terbaik...
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Row 1: Kanan ke Kiri */}
              <div className="overflow-hidden w-full relative">
                <div
                  className="flex gap-4 items-center w-max animate-marquee-left"
                  style={{ animationDuration: "20s" }}
                >
                  {finalRow1.map((client, i) => (
                    <div key={`client-r1-${i}`} className="flex items-center justify-center w-36 h-20 shrink-0 border border-base-200 rounded-2xl bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer p-3" title={client.nama_perusahaan}>
                      {client.logo_path ? (
                        <img src={`http://localhost:8000/storage/${client.logo_path}`} alt={client.nama_perusahaan} className="object-contain w-full h-full" />
                      ) : (
                        <span className="font-extrabold text-xs text-secondary">{client.nama_perusahaan}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: Kiri ke Kanan */}
              {finalRow2.length > 0 && (
                <div className="overflow-hidden w-full relative">
                  <div
                    className="flex gap-4 items-center w-max animate-marquee-right"
                    style={{ animationDuration: "20s" }}
                  >
                    {finalRow2.map((client, i) => (
                      <div key={`client-r2-${i}`} className="flex items-center justify-center w-36 h-20 shrink-0 border border-base-200 rounded-2xl bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer p-3" title={client.nama_perusahaan}>
                        {client.logo_path ? (
                          <img src={`http://localhost:8000/storage/${client.logo_path}`} alt={client.nama_perusahaan} className="object-contain w-full h-full" />
                        ) : (
                          <span className="font-extrabold text-xs text-secondary">{client.nama_perusahaan}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
        <style>{`
          @keyframes heroBubble {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-500px) scale(0.8); opacity: 0; }
          }
          @keyframes heroFadeUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes scrollBounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
            40% { transform: translateY(-6px) translateX(-50%); }
            60% { transform: translateY(-3px) translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════ LAYANAN PER KATEGORI ══════════════════════════════ */}
      <section className="w-full pt-10 pb-16" style={{background: 'linear-gradient(180deg, #f8fffe 0%, #f0faf7 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-3">
                SOLUSI BISNIS
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-secondary tracking-tight leading-[1.1]">
                Layanan <span className="text-secondary/50 font-normal">per Kategori</span>
              </h2>
              <p className="text-base-content/60 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
                Dikelompokkan per area bisnis: web, mobile, IoT, dan cloud.
              </p>
            </div>
            <Link to="/layanan" className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center gap-1.5 shrink-0 group">
              Lihat Semua <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.filter(cat => !['consulting', 'coaching', 'management', 'assistance'].includes(cat.slug)).slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              to={`/layanan?kategori=${cat.slug}`}
              className="bg-white border border-primary/10 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 rounded-3xl p-5 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <ServiceIcon iconId={cat.iconId} className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-secondary group-hover:text-primary transition-colors mb-1 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
              <div className="pt-1 flex items-center text-xs sm:text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                Jelajahi &rarr;
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* ══════════════════════════════ LAYANAN UNGGULAN (LIGHT THEME COCOK DENGAN WEB) ══════════════════════════════ */}
      {layananUnggulan.length > 0 && (
        <section className="w-full py-16 bg-[#F4FAF8] border-t border-primary/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-3">
                  APA YANG KAMI KERJAKAN
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-secondary tracking-tight leading-[1.1]">
                  Layanan <span className="text-secondary/50 font-normal">Unggulan</span>
                </h2>
              </div>
              <Link to="/layanan" className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center gap-1.5 shrink-0 group">
                Semua layanan <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {layananUnggulan.map((item, idx) => {
                const isFirst = idx === 0;
                return (
                  <div 
                    key={item.id} 
                    className={`card bg-white border border-primary/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-72 shadow-[0_4px_20px_rgba(46,150,120,0.03)] hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden ${
                      isFirst ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div>
                      {/* Urutan Nomor */}
                      <span className="absolute top-4 left-6 text-4xl sm:text-5xl font-black text-primary/30 select-none font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Tag Kategori */}
                      <div className="flex justify-end mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {item.kategori}
                        </span>
                      </div>

                      {/* Konten */}
                      <div className="space-y-2 mt-4 text-left">
                        <h3 className="font-extrabold text-secondary text-lg sm:text-xl group-hover:text-primary transition-colors duration-200">
                          {item.judul}
                        </h3>
                        <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed line-clamp-3">
                          {item.deskripsi}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-base-100 flex items-center">
                      <Link 
                        to={`/layanan?kategori=${item.slug}`}
                        className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1 hover:translate-x-1 transition-all"
                      >
                        <span>Pelajari lebih lanjut</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════ PRODUK UNGGULAN ══════════════════════════════ */}
      {products && products.length > 0 && (
        <section className="w-full py-16 bg-slate-50/50 border-t border-base-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-3">
                    KATALOG SISTEM
                  </span>
                  <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-secondary tracking-tight leading-[1.1]">
                    Produk <span className="text-secondary/50 font-normal">& Solusi TI</span>
                  </h2>
                  <p className="text-base-content/60 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
                    Kumpulan sistem informasi dan produk teknologi inovatif yang siap diimplementasikan.
                  </p>
                </div>
                <Link to="/produk" className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center gap-1.5 shrink-0 group">
                  Lihat Semua Produk <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id_produk}
                  className="group relative bg-white border border-primary/5 hover:border-primary/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(46,150,120,0.12)] hover:-translate-y-1.5 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col h-full justify-between"
                >
                  <div>
                    <figure className="h-48 bg-base-200 relative overflow-hidden shrink-0">
                      {prod.foto_sampul ? (
                        <img
                          src={`http://localhost:8000/storage/${prod.foto_sampul}`}
                          alt={prod.nama}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          width="350"
                          height="192"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-secondary via-[#196B58] to-primary p-6 relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-65 relative z-10 animate-pulse text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/70 mt-3 relative z-10">System Ready</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-secondary/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-[9px] tracking-wider uppercase">
                        Ready System
                      </span>
                    </figure>

                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                        {getProductCategory(prod.nama)}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-secondary group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {prod.nama}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-base-content/60 leading-relaxed line-clamp-3">
                        {prod.deskripsi_singkat}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/produk/${prod.slug}`}
                      className="relative overflow-hidden group/btn btn btn-sm rounded-xl w-full font-bold tracking-wide transition-all bg-secondary text-white hover:bg-primary border-none shadow-md shadow-secondary/10 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-1.5"
                    >
                      <span>Lihat Detail & Penawaran</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════ KEUNGGULAN (DESAIN NON-BOX MODERN) ══════════════════════════════ */}
      <section className="w-full py-20 bg-base-100 border-t border-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Kiri: Judul & Desain Visual Kurva (Representasi Nama Kurva) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                  Keunggulan Kami
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
                  Mengapa Memilih <span className="text-primary italic">Kurva?</span>
                </h2>
                <p className="text-base-content/60 text-base mt-4 leading-relaxed">
                  Komitmen kami pada setiap proyek yang kami kerjakan untuk memberikan performa terbaik, kualitas kode tingkat tinggi, serta pendampingan berkelanjutan bagi pertumbuhan bisnis Anda.
                </p>
              </div>
              
              {/* Desain Visual Garis Kurva / Wave SVG Premium */}
              {settings.keunggulan_visual ? (
                <div className="relative w-full h-56 rounded-3xl overflow-hidden border border-primary/5 shadow-sm">
                  <img src={`http://localhost:8000/storage/${settings.keunggulan_visual}`} alt="Keunggulan Visual" className="object-cover w-full h-full" loading="lazy" width="400" height="224" />
                </div>
              ) : (
                <div className="relative w-full h-56 bg-gradient-to-br from-primary/5 to-emerald-500/5 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-primary/5">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-30" />
                  <svg className="w-full h-full relative z-10" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M10 70 Q 50 15, 100 70 T 190 30" 
                      stroke="url(#gradient-kurva)" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient-kurva" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>

            {/* Kanan: Daftar Detail Karakter Keunggulan */}
            <div className="lg:col-span-7 space-y-10">
              {(keunggulans.length > 0 ? keunggulans : [
                { id: 1, judul: 'Pengerjaan Tepat Waktu', deskripsi: 'Setiap proyek kami kerjakan dengan timeline yang terukur and disiplin tinggi demi menghargai waktu peluncuran bisnis Anda.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 2, judul: 'Kualitas Code Bersih', deskripsi: 'Menjaga kode program tetap standar, terstruktur, terdokumentasi dengan baik, dan mudah dipelihara di masa depan.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                { id: 3, judul: 'Dukungan Maintenance 3 Bulan', deskripsi: 'Layanan pasca pengerjaan gratis 3 bulan untuk menjamin kestabilan sistem setelah go-live dari berbagai kendala operasional.', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' }
              ]).map((item, idx) => (
                <div key={item.id || idx} className="flex gap-6 items-start relative">
                  <span className="text-5xl sm:text-6xl font-black text-primary/10 tracking-tight select-none mt-1 font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon || 'M13 10V3L4 14h7v7l9-11h-7z'} />
                        </svg>
                      </div>
                      <h3 className="font-extrabold text-secondary text-base sm:text-[17px] tracking-wide">{item.judul}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed max-w-xl">{item.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════ STATS / RINGKASAN ══════════════════════════════ */}
      <section className="w-full border-y border-base-200/40 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f4f8f6] to-[#e8f2ee] rounded-3xl p-6 sm:p-12 lg:p-16 border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Kiri: Grid Statistik */}
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-10 sm:gap-y-16">
              {[
                { value: settings.jumlah_proyek || "150", suffix: "+", title: "Proyek selesai", desc: "di berbagai industri" },
                { value: "98", suffix: "%", title: "Tingkat kepuasan", desc: "berdasarkan feedback klien" },
                { value: "5", suffix: "+", title: "Tahun pengalaman", desc: "aktif di industri digital" },
                { value: "24/7", suffix: "", title: "Dukungan teknis", desc: "monitoring & maintenance" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <div className="text-left mb-2">
                    <StatCounter target={String(s.value)} suffix={s.suffix} />
                  </div>
                  <h4 className="text-sm sm:text-[15px] font-bold text-secondary">{s.title}</h4>
                  <p className="text-xs sm:text-sm text-base-content/60 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Kanan: Ringkasan */}
            <div className="lg:pl-20 border-t lg:border-t-0 lg:border-l border-base-200 pt-10 lg:pt-0">
              <h3 className="text-xs font-bold text-base-content/50 tracking-[0.2em] uppercase mb-4 sm:mb-8">Ringkasan</h3>
              <p className="text-xl sm:text-3xl lg:text-[2.5rem] font-bold text-secondary leading-[1.2] mb-6 sm:mb-8">
                "Solusi yang tetap bekerja setelah go-live."
              </p>
              <p className="text-base-content/75 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 max-w-md">
                {settings.nama_situs || "Kurva"} terlibat dari konsultasi awal hingga produk live dan stabil.
              </p>
              <div className="w-12 h-[3px] rounded-full bg-primary/40" />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════ ARTIKEL ══════════════════════════════ */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-3">
                ARTIKEL & INFORMASI
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-secondary tracking-tight leading-[1.1]">
                Artikel <span className="text-secondary/50 font-normal">Terbaru</span>
              </h2>
              <p className="text-base-content/60 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
                Wawasan teknologi dan bisnis terbaru dari tim ahli kami untuk membantu bisnis Anda berkembang.
              </p>
            </div>
            <Link to="/blog" className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center gap-1.5 shrink-0 group">
              Lihat Semua <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id_artikel} className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <figure className="h-48 sm:h-52 bg-base-200 relative overflow-hidden">
                  {article.foto_sampul ? (
                    <img src={`http://localhost:8000/storage/${article.foto_sampul}`} alt={article.judul} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" loading="lazy" width="384" height="192" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/20 bg-gradient-to-br from-primary/5 to-accent/5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm">
                    {article.kategori?.nama_kategori}
                  </span>
                </figure>
                <div className="card-body p-5 space-y-2">
                  <h3 className="font-bold text-lg text-neutral-800 hover:text-primary transition-colors leading-snug">
                    <Link to={`/blog/${article.slug}`}>{article.judul}</Link>
                  </h3>
                  <p className="text-sm text-base-content/60 line-clamp-2">{article.konten?.replace(/<[^>]*>/g, "")}</p>
                  <div className="pt-3 flex justify-between items-center text-xs text-base-content/50 border-t border-base-200">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {article.penulis?.name}
                    </span>
                    <span>{new Date(article.dipublikasikan_pada).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════ TESTIMONI ══════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-16 overflow-hidden w-full relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-3">
                TESTIMONI KLIEN
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-secondary tracking-tight leading-[1.1]">
                Apa Kata <span className="text-secondary/50 font-normal">Klien Kami</span>
              </h2>
              <p className="text-base-content/60 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
                Kepercayaan Anda adalah prioritas utama kami dalam menghadirkan solusi teknologi terbaik.
              </p>
            </div>
          </div>
          <div className="w-full relative">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* ══════════════════════════════ DISKUSIKAN PROYEK ══════════════════════════════ */}
      <ContactFormSection settings={settings} />

    </div>
  )
}