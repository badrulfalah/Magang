import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const getProductCategory = (name) => {
  const n = name.toLowerCase();
  if (n.includes('iot') || n.includes('sensor') || n.includes('monitoring') || n.includes('dashboard')) return 'IoT & Hardware';
  if (n.includes('erp') || n.includes('resource') || n.includes('finance') || n.includes('invent')) return 'Enterprise System';
  if (n.includes('siakad') || n.includes('akademik') || n.includes('sekolah') || n.includes('kampus')) return 'Education Tech';
  return 'Sistem Terintegrasi';
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/public/produk')
      .then(res => {
        setProducts(res.data?.data || [])
      })
      .catch(err => {
        console.error('Gagal mengambil data produk:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block">Portofolio Sistem</span>
        <h1 className="text-4xl sm:text-6xl font-bold text-secondary tracking-tight leading-[1.1]">
          Produk <span className="text-secondary/50 font-normal">& Solusi TI</span>
        </h1>
        <p className="text-base-content/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Kumpulan sistem informasi dan produk teknologi inovatif yang siap diimplementasikan untuk kebutuhan bisnis atau institusi Anda.
        </p>
      </section>

      {/* ── PRODUCTS GRID ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto text-base-content/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-secondary">Belum Ada Produk</h3>
          <p className="text-xs text-base-content/50 max-w-xs mx-auto">Kami sedang mempersiapkan daftar produk unggulan kami. Silakan kembali beberapa saat lagi.</p>
        </div>
      ) : (
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
      )}
    </div>
  )
}
