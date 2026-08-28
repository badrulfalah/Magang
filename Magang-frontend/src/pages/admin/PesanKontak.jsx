import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_CONFIG = {
  new: {
    label: 'Baru',
    badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    dotClass: 'bg-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  read: {
    label: 'Dibaca',
    badgeClass: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    dotClass: 'bg-amber-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  replied: {
    label: 'Dibalas',
    badgeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  }
}

function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${padding} ${cfg.badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass} shrink-0`}></span>
      {cfg.label}
    </span>
  )
}

export default function PesanKontak() {
  const [messages, setMessages] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [followingUp, setFollowingUp] = useState(false)
  const [showFollowupModal, setShowFollowupModal] = useState(false)
  const [followupMessage, setFollowupMessage] = useState('')
  const [followupError, setFollowupError] = useState('')
  const navigate = useNavigate()

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/pesan-kontak', { params: { page, search } })
      setMessages(res.data.data || [])
      setMeta(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const openShow = async (msg) => {
    setSelectedMessage(msg)
    setShowModal(true)
    if (msg.status === 'new') {
      try {
        const res = await api.put(`/admin/pesan-kontak/${msg.id_pesan_kontak}`, { status: 'read' })
        setSelectedMessage(res.data)
        fetchMessages()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setUpdating(true)
    try {
      const res = await api.put(`/admin/pesan-kontak/${id}`, { status })
      setSelectedMessage(res.data)
      fetchMessages()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pesan kontak ini? Tindakan ini tidak dapat dibatalkan.')) return
    setDeleting(true)
    try {
      await api.delete(`/admin/pesan-kontak/${id}`)
      setShowModal(false)
      setSelectedMessage(null)
      fetchMessages()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const openFollowupModal = () => {
    const nama = selectedMessage?.nama || 'pelanggan'
    const subjek = selectedMessage?.subjek || ''
    setFollowupMessage(`Halo ${nama}, terima kasih telah menghubungi kami melalui formulir kontak mengenai "${subjek}". Tim kami siap membantu Anda, silakan sampaikan lebih lanjut kebutuhan Anda.`)
    setFollowupError('')
    setShowFollowupModal(true)
  }

  const handleFollowupViaChat = async () => {
    if (!selectedMessage) return
    if (!selectedMessage.id_user) {
      setFollowupError('Pesan ini dikirim oleh pengunjung yang belum memiliki akun. Tidak dapat membuka sesi chat.')
      return
    }
    setFollowingUp(true)
    setFollowupError('')
    try {
      const res = await api.post('/chats/followup-from-form', {
        id_pesan_kontak: selectedMessage.id_pesan_kontak,
        pesan_awal: followupMessage.trim() || undefined
      })
      setShowFollowupModal(false)
      setShowModal(false)
      fetchMessages()
      navigate('/admin/chat', { state: { activeChatId: res.data.session_id } })
    } catch (err) {
      console.error(err)
      const errMsg = err.response?.data?.message || 'Gagal membuka sesi chat. Silakan coba lagi.'
      setFollowupError(errMsg)
    } finally {
      setFollowingUp(false)
    }
  }

  const newCount = messages.filter(m => m.status === 'new').length

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Pesan Kontak</h1>
          <p className="text-base-content/60 text-sm mt-0.5">Kelola pesan kontak masuk dari pengunjung website</p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-xl text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {newCount} pesan baru belum dibaca
          </div>
        )}
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-6">
          {/* Search bar */}
          <div className="flex justify-between items-center mb-5">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari nama, email, subjek..."
                className="input input-bordered rounded-xl input-sm w-72 pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <span className="text-sm text-base-content/50 font-medium">{meta.total || 0} total pesan</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50 text-[11px] uppercase tracking-wider text-base-content/50">
                  <th className="w-10">#</th>
                  <th>Pengirim</th>
                  <th>Subjek</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th className="w-20 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-12">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  </td></tr>
                ) : messages.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-base-content/50">Tidak ada pesan kontak</p>
                    </div>
                  </td></tr>
                ) : (
                  messages.map((msg, i) => (
                    <tr
                      key={msg.id_pesan_kontak}
                      className={`hover:bg-base-200/30 transition-colors cursor-pointer ${msg.status === 'new' ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''}`}
                      onClick={() => openShow(msg)}
                    >
                      <td className="text-base-content/40 text-xs font-mono">
                        {(meta.current_page - 1) * meta.per_page + i + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {msg.nama?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`text-sm ${msg.status === 'new' ? 'font-bold' : 'font-medium'} text-base-content`}>{msg.nama}</p>
                            <p className="text-xs text-base-content/50">{msg.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`text-sm line-clamp-1 ${msg.status === 'new' ? 'font-semibold' : ''}`}>{msg.subjek}</span>
                      </td>
                      <td>
                        <StatusBadge status={msg.status} />
                      </td>
                      <td className="text-xs text-base-content/50 whitespace-nowrap">
                        {new Date(msg.dikirim_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); openShow(msg) }}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-900/30 border border-blue-200/50 dark:border-blue-900/50 transition-all duration-200 hover:scale-105"
                          title="Lihat Detail"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex justify-center mt-5">
              <div className="join">
                <button className="join-item btn btn-sm rounded-l-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>«</button>
                <button className="join-item btn btn-sm btn-disabled">Hal {meta.current_page}/{meta.last_page}</button>
                <button className="join-item btn btn-sm rounded-r-xl" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Detail Pesan Kontak ── */}
      {showModal && selectedMessage && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-3xl max-w-xl p-0 overflow-hidden shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-base-200 bg-base-100">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shrink-0">
                {selectedMessage.nama?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-base-content truncate">{selectedMessage.nama}</h3>
                <p className="text-xs text-base-content/50 truncate">{selectedMessage.email}</p>
              </div>
              <StatusBadge status={selectedMessage.status} size="md" />
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300/50">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-1">No. HP / WhatsApp</p>
                  {selectedMessage.no_hp ? (
                    <a
                      href={`https://wa.me/${selectedMessage.no_hp.replace(/^0/, '62').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.77.465 3.42 1.27 4.855L2 22l5.305-1.252A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                      {selectedMessage.no_hp}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-base-content/40">-</p>
                  )}
                </div>

                <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300/50">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-1">Waktu Kirim</p>
                  <p className="text-sm font-semibold text-base-content">
                    {new Date(selectedMessage.dikirim_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {new Date(selectedMessage.dikirim_pada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                </div>
              </div>

              {/* Subjek */}
              <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300/50">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-1.5">Subjek Pesan</p>
                <p className="font-bold text-base text-base-content">{selectedMessage.subjek}</p>
              </div>

              {/* Isi Pesan */}
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-2">Isi Pesan</p>
                <div className="p-4 bg-base-200/70 rounded-2xl border border-base-300/50 whitespace-pre-line text-base-content leading-relaxed text-sm min-h-[80px]">
                  {selectedMessage.pesan}
                </div>
              </div>

              {/* Status Update */}
              <div className="p-4 bg-base-200/30 rounded-2xl border border-base-300/50">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-3">Perbarui Status</p>
                <div className="flex gap-2 flex-wrap">
                  {/* Mark as Read */}
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id_pesan_kontak, 'read')}
                    disabled={updating || selectedMessage.status === 'read'}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      selectedMessage.status === 'read'
                        ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700 cursor-default'
                        : 'bg-base-100 text-base-content/70 border-base-300 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {selectedMessage.status === 'read' ? '✓ Sudah Dibaca' : 'Tandai Dibaca'}
                  </button>

                  {/* Mark as Replied */}
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id_pesan_kontak, 'replied')}
                    disabled={updating || selectedMessage.status === 'replied'}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      selectedMessage.status === 'replied'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 cursor-default'
                        : 'bg-base-100 text-base-content/70 border-base-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {selectedMessage.status === 'replied' ? '✓ Sudah Dibalas' : 'Tandai Dibalas'}
                  </button>

                  {/* WhatsApp quick reply */}
                  {selectedMessage.no_hp && (
                    <a
                      href={`https://wa.me/${selectedMessage.no_hp.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${selectedMessage.nama}, terima kasih telah menghubungi kami mengenai "${selectedMessage.subjek}". `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border bg-base-100 text-base-content/70 border-base-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.77.465 3.42 1.27 4.855L2 22l5.305-1.252A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                      Balas via WhatsApp
                    </a>
                  )}

                  {/* Balas via Chat */}
                  <button
                    onClick={openFollowupModal}
                    disabled={!selectedMessage.id_user}
                    title={!selectedMessage.id_user ? 'Pengirim tidak memiliki akun — tidak dapat membuka chat' : 'Buka sesi chat dan kirim pesan follow-up'}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      !selectedMessage.id_user
                        ? 'opacity-40 cursor-not-allowed bg-base-100 text-base-content/50 border-base-300'
                        : 'bg-base-100 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Balas via Chat
                    {!selectedMessage.id_user && <span className="text-[10px] font-normal">(tanpa akun)</span>}
                  </button>

                  {updating && <span className="loading loading-spinner loading-xs text-primary self-center ml-1"></span>}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-50 dark:bg-base-200/20">
              <button
                type="button"
                disabled={deleting}
                className="flex items-center gap-2 btn btn-sm rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50 font-semibold"
                onClick={() => handleDelete(selectedMessage.id_pesan_kontak)}
              >
                {deleting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Hapus Pesan
              </button>
              <button
                type="button"
                className="btn btn-sm rounded-xl btn-ghost font-semibold"
                onClick={() => { setShowModal(false); setSelectedMessage(null) }}
              >
                Tutup
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => { setShowModal(false); setSelectedMessage(null) }}>close</button>
          </form>
        </dialog>
      )}

      {/* ── Modal Konfirmasi Follow-up via Chat ── */}
      {showFollowupModal && selectedMessage && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-3xl max-w-lg p-0 overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-base-200 bg-gradient-to-r from-primary/5 to-blue-500/5">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-base-content">Balas via Chat</h3>
                <p className="text-xs text-base-content/50">Follow-up ke: <span className="font-semibold text-primary">{selectedMessage.nama}</span></p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Info konteks */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Sistem akan membuka atau menemukan sesi chat aktif dengan <strong>{selectedMessage.nama}</strong>, mengklaimnya untuk Anda, lalu mengirim pesan berikut sebagai pesan pertama.
                </div>
              </div>

              {/* Subjek formulir */}
              <div className="text-xs">
                <p className="font-semibold text-base-content/50 uppercase tracking-wider mb-1">Dari pesan formulir</p>
                <div className="p-3 bg-base-200/60 rounded-xl border border-base-300/50">
                  <p className="font-semibold text-base-content text-sm">{selectedMessage.subjek}</p>
                  <p className="text-base-content/50 mt-0.5 line-clamp-2">{selectedMessage.pesan}</p>
                </div>
              </div>

              {/* Textarea pesan awal */}
              <div>
                <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider block mb-1.5">
                  Pesan Pertama (dapat diedit)
                </label>
                <textarea
                  className="textarea textarea-bordered rounded-2xl w-full text-sm leading-relaxed resize-none focus:outline-primary"
                  rows={4}
                  value={followupMessage}
                  onChange={(e) => setFollowupMessage(e.target.value)}
                  placeholder="Tulis pesan follow-up untuk customer..."
                />
              </div>

              {/* Error */}
              {followupError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">{followupError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-200">
              <button
                type="button"
                className="btn btn-sm rounded-xl btn-ghost font-semibold"
                onClick={() => setShowFollowupModal(false)}
                disabled={followingUp}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-sm rounded-xl btn-primary font-semibold text-white border-none min-w-[140px]"
                onClick={handleFollowupViaChat}
                disabled={followingUp || !followupMessage.trim()}
              >
                {followingUp ? (
                  <><span className="loading loading-spinner loading-xs"></span> Membuka Chat...</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Buka Chat &amp; Kirim
                  </>
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setShowFollowupModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}