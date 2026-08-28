import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { serviceCategories as staticCategories } from '../../data/servicesData'
import { ServiceIcon } from '../../components/ServiceIcon'
import api from '../../api/axios'

export default function Services() {
  const { categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategoryParam = searchParams.get('kategori') || categorySlug

  const [settings, setSettings] = useState({})
  const [categories, setCategories] = useState(staticCategories)

  useEffect(() => {
    api.get('/public/pengaturan')
      .then(res => setSettings(res.data || {}))
      .catch(err => console.error(err))

    api.get('/public/layanan')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(cat => ({
            id: cat.id_kategori_layanan,
            slug: cat.slug,
            name: cat.name,
            subtitle: cat.subtitle,
            description: cat.description,
            iconId: cat.icon_id,
            itemsCount: `${cat.layanan?.length || 0} solusi dalam kategori ini`,
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
      .catch(err => console.error("Failed to load services:", err))
  }, [])

  const waNumber = (settings.no_telp || "081234567890").replace(/\D/g, "")
  const waLink = `https://wa.me/62${waNumber.startsWith("0") ? waNumber.slice(1) : waNumber}`

  // Find active category if selected
  const activeCategory = categories.find(
    c => c.slug === activeCategoryParam || String(c.id) === String(activeCategoryParam)
  )

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

      {activeCategory ? (
        /* ══════════ CATEGORY DETAIL VIEW ══════════ */
        <div className="space-y-12">

          {/* Back button */}
          <button
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary transition-colors"
          >
            &larr; Semua layanan
          </button>

          {/* Category Hero Header */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Kategori Layanan</span>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ServiceIcon iconId={activeCategory.iconId} className="h-6 w-6" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-secondary">{activeCategory.name}</h1>
            </div>
            <p className="text-base sm:text-lg text-base-content/70 max-w-2xl leading-relaxed">
              {activeCategory.description}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-base-200 text-base-content/70 border border-base-300">
                {activeCategory.itemsCount}
              </span>
            </div>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/40 transition-all rounded-3xl p-5 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-primary/40">{item.num}</span>
                    <div className="flex gap-1.5">
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                          item.badge === 'UNGGULAN' ? 'bg-primary/15 text-primary' :
                          item.badge === 'POPULER' ? 'bg-amber-500/15 text-amber-600' :
                          'bg-sky-500/15 text-sky-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-base-200 text-base-content/60">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-secondary leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-base-200 flex items-center justify-between">
                  <Link
                    to="/kontak"
                    className="btn btn-primary border-none btn-sm rounded-xl text-white font-bold px-4"
                  >
                    Konsultasi
                  </Link>
                  <a
                    href={`${waLink}?text=${encodeURIComponent(`Halo Kurva, saya ingin bertanya mengenai paket ${item.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Tanya WA &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* ══════════ OVERVIEW — Layanan per Kategori ══════════ */
        <div className="space-y-12">

          {/* Header */}
          <div className="flex flex-col gap-6 border-b border-base-200 pb-6">
            <div className="text-left">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Katalog</span>
              <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-normal">Pilih Layanan</h1>
              <p className="text-base-content/60 text-sm mt-1">Web, mobile, IoT, dan solusi kustom.</p>
            </div>
            
            {/* Kategori Tab Filter */}
            <div className="flex flex-wrap gap-2 justify-start">
              <button 
                onClick={() => setSearchParams({})}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  !activeCategoryParam 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-base-100 hover:bg-base-200 text-base-content/75 border-base-200'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ kategori: cat.slug })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeCategoryParam === cat.slug || String(cat.id) === String(activeCategoryParam)
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-base-100 hover:bg-base-200 text-base-content/75 border-base-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category List Layout (Like BoasfarDev) */}
          <div className="space-y-12">
            {categories
              .filter(cat => !activeCategoryParam || cat.slug === activeCategoryParam || String(cat.id) === String(activeCategoryParam))
              .map((cat) => (
                <div key={cat.id} className="space-y-5">
                  {/* Category Title & Icon */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ServiceIcon iconId={cat.iconId} className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-secondary leading-snug">{cat.name}</h2>
                      <p className="text-xs text-base-content/50 mt-0.5">{cat.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-base-content/40 font-bold ml-auto uppercase bg-base-200 px-2 py-0.5 rounded">
                      {cat.items?.length || 0} layanan
                    </span>
                  </div>

                  {/* Solutions list cards in 3 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(cat.items || []).map((item, idx) => (
                      <div
                        key={item.id}
                        className="card bg-base-100 border border-base-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-primary/30 transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between h-48"
                      >
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-bold text-base-content/30">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex gap-1.5">
                              {item.badge && (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                                  item.badge === 'UNGGULAN' ? 'bg-primary/15 text-primary' :
                                  item.badge === 'POPULER' ? 'bg-amber-500/15 text-amber-600' :
                                  'bg-sky-500/15 text-sky-600'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-base-200 text-base-content/50">
                                {item.tag}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-neutral-800 leading-snug">{item.title}</h3>
                            <p className="text-xs text-base-content/60 leading-relaxed mt-1 line-clamp-3">{item.desc}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-base-200 flex items-center justify-between">
                          <Link
                            to="/kontak"
                            className="btn btn-primary border-none btn-xs rounded-lg text-white font-bold px-3 py-1 h-auto"
                          >
                            Konsultasi
                          </Link>
                          <a
                            href={`${waLink}?text=${encodeURIComponent(`Halo Kurva, saya ingin bertanya mengenai paket ${item.title}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            Tanya WA &rarr;
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* ══════════ CTA Bottom Banner ══════════ */}
      <section className="bg-secondary text-secondary-content rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden space-y-6">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <span className="text-xs font-bold uppercase tracking-wider text-primary block">Kebutuhan Spesifik</span>
        <h2 className="text-2xl sm:text-4xl font-black text-white max-w-2xl mx-auto leading-tight">
          Tidak menemukan yang <span className="text-primary">Anda cari?</span>
        </h2>
        <p className="text-sm sm:text-base text-secondary-content/75 max-w-xl mx-auto leading-relaxed">
          Kami juga menerima custom development. Diskusikan tanpa kewajiban.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            to="/kontak"
            className="btn btn-primary border-none btn-md rounded-xl text-white font-bold px-7 shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            Konsultasi Sekarang
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white btn-md rounded-xl font-bold px-7 gap-2 w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}
