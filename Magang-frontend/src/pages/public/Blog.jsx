import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function Blog() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [articles, setArticles] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/public/kategori-artikel')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
  }, [])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page }
      if (selectedCategory) params.kategori = selectedCategory

      const res = await api.get('/public/artikel', { params })
      setArticles(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, selectedCategory])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    setPage(1)
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block">Artikel & Informasi</span>
        <h1 className="text-4xl sm:text-6xl font-bold text-secondary tracking-tight leading-[1.1]">
          Kabar <span className="text-secondary/50 font-normal">& Artikel</span>
        </h1>
        <p className="text-base-content/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Temukan info teknologi terbaru, tips optimasi sistem, dan tren bisnis terkini dari tim kami.
        </p>
      </section>

      <section className="flex flex-wrap gap-2.5 justify-center pb-6 border-b border-base-200">
        <button
          onClick={() => handleCategoryChange('')}
          className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
            !selectedCategory
              ? 'bg-secondary text-white shadow-lg shadow-secondary/25 scale-105'
              : 'bg-white border border-base-200 text-base-content/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:scale-105'
          }`}
        >
          {!selectedCategory && (
            <span className="absolute inset-0 rounded-full bg-primary/20 blur-sm" />
          )}
          <span className="relative">Semua Kategori</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id_kategori_artikel}
            onClick={() => handleCategoryChange(cat.id_kategori_artikel)}
            className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
              selectedCategory === cat.id_kategori_artikel
                ? 'bg-secondary text-white shadow-lg shadow-secondary/25 scale-105'
                : 'bg-white border border-base-200 text-base-content/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:scale-105'
            }`}
          >
            {selectedCategory === cat.id_kategori_artikel && (
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-sm" />
            )}
            <span className="relative">{cat.nama_kategori}</span>
          </button>
        ))}
      </section>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-base-content/50">Tidak ada artikel dalam kategori ini.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id_artikel} className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <figure className="h-48 bg-base-200 relative overflow-hidden">
                {article.foto_sampul ? (
                  <img src={`http://localhost:8000/storage/${article.foto_sampul}`} alt={article.judul} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/30 bg-primary/5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm">{article.kategori?.nama_kategori}</span>
              </figure>
              <div className="card-body p-5 space-y-2">
                <h3 className="font-bold text-lg text-secondary leading-snug hover:text-primary">
                  <Link to={`/blog/${article.slug}`}>{article.judul}</Link>
                </h3>
                <p className="text-sm text-base-content/60 line-clamp-3">{article.konten}</p>
                <div className="pt-2 flex justify-between items-center text-xs text-base-content/50 border-t border-base-200">
                  <span>Oleh: {article.penulis?.name}</span>
                  <span>{new Date(article.dipublikasikan_pada).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && meta.last_page > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>«</button>
            <button className="join-item btn btn-sm btn-disabled">Hal {meta.current_page}/{meta.last_page}</button>
            <button className="join-item btn btn-sm" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>»</button>
          </div>
        </div>
      )}
    </div>
  )
}