import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function BlogDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/public/artikel/${slug}`)
      .then(res => setArticle(res.data))
      .catch(err => {
        console.error(err)
        setError('Artikel tidak ditemukan')
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-error">{error || 'Artikel tidak ditemukan'}</h1>
        <Link to="/blog" className="btn btn-primary btn-sm rounded-lg">Kembali ke Blog</Link>
      </div>
    )
  }

  return (
    <article className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="space-y-4">
        <span className="badge badge-primary font-semibold text-sm">{article.kategori?.nama_kategori}</span>
        <h1 className="text-3xl sm:text-4xl font-black text-secondary leading-tight">{article.judul}</h1>
        <div className="flex items-center gap-4 text-xs text-base-content/50 border-y border-base-200 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base-content">{article.penulis?.name}</span>
          </div>
          <span>•</span>
          <span>Dipublikasikan pada {new Date(article.dipublikasikan_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {article.foto_sampul && (
        <div className="h-64 sm:h-96 rounded-2xl bg-base-200 overflow-hidden shadow-sm">
          <img src={`http://localhost:8000/storage/${article.foto_sampul}`} alt={article.judul} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="prose max-w-none text-base-content/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
        {article.konten}
      </div>

      <div className="pt-6 border-t border-base-200 flex justify-between">
        <Link to="/blog" className="text-primary hover:text-primary-focus font-semibold text-sm">&larr; Kembali ke Blog</Link>
      </div>
    </article>
  )
}