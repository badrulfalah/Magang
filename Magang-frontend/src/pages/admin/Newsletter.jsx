import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/pelanggan-newsletter', { params: { page, search } })
      setSubscribers(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pelanggan newsletter ini?')) return
    try {
      await api.delete(`/admin/pelanggan-newsletter/${id}`)
      fetchSubscribers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Pelanggan Newsletter</h1>
        <p className="text-base-content/60 text-sm">Kelola daftar email pelanggan newsletter</p>
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari email..."
              className="input input-bordered rounded-xl input-sm w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <span className="text-sm text-base-content/60">{meta.total || 0} pelanggan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-12">#</th>
                  <th>Email</th>
                  <th>Akun Customer</th>
                  <th>Status</th>
                  <th>Tanggal Berlangganan</th>
                  <th className="w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8"><span className="loading loading-spinner loading-md"></span></td></tr>
                ) : subscribers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-base-content/50">Tidak ada data</td></tr>
                ) : (
                  subscribers.map((sub, i) => (
                    <tr key={sub.id_newsletter} className="hover">
                      <td className="text-base-content/50">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                      <td><span className="font-medium text-secondary">{sub.email}</span></td>
                      <td><span className="text-xs">{sub.user?.name || '-'}</span></td>
                      <td>
                        <span className={`badge badge-xs ${sub.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/50">
                        {new Date(sub.berlangganan_pada).toLocaleDateString('id-ID')}
                      </td>
                      <td>
                          <button 
                            onClick={() => handleDelete(sub.id_newsletter)} 
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30 border border-rose-200/50 dark:border-rose-900/50 transition-all duration-200 hover:scale-105"
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta.last_page > 1 && (
            <div className="flex justify-center mt-4">
              <div className="join">
                <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>«</button>
                <button className="join-item btn btn-sm btn-disabled">Hal {meta.current_page}/{meta.last_page}</button>
                <button className="join-item btn btn-sm" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>»</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}