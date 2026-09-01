import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, hasPermission } = useAuth()
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
    articles: 0,
    testimonials: 0,
    team: 0,
    faqs: 0,
    proyeks: 0,
    penawarans: 0,
    chats: 0,
    newMessages: 0,
    recentMessages: [],
    allLeads: []
  })

  // Marketing specific states
  const [marketingStats, setMarketingStats] = useState({
    totalChats: 0,
    myChats: 0,
    activeLeads: 0,
    pendingTestimonials: 0,
    totalPenawarans: 0,
    totalProyeks: 0,
    recentMessages: [],
    allLeads: []
  })

  // Customer specific states
  const [customerStats, setCustomerStats] = useState({
    activeProjects: 0,
    consultationsCount: 0,
    supportTickets: 0,
    accountStatus: 'Aktif',
    recentMessages: []
  })

  // Modal detail pesan formulir
  const [selectedFormMessage, setSelectedFormMessage] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)

  const isCustomer = user?.roles?.some(role => role.name === 'customer')
  const isMarketing = user?.roles?.some(role => role.name === 'marketing')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats')
        const d = res.data || {}
        if (isCustomer && d.customer) {
          setCustomerStats(d.customer)
        } else if (isMarketing && d.marketing) {
          setMarketingStats({
            totalChats: d.marketing.totalChats || 0,
            myChats: d.marketing.myChats || 0,
            activeLeads: d.marketing.activeLeads || 0,
            pendingTestimonials: d.marketing.pendingTestimonials || 0,
            totalPenawarans: d.marketing.totalPenawarans || 0,
            totalProyeks: d.marketing.totalProyeks || 0,
            recentMessages: d.marketing.recentMessages || [],
            allLeads: d.marketing.allLeads || []
          })
        } else {
          setStats({
            users: d.users || 0,
            roles: d.roles || 0,
            permissions: d.permissions || 0,
            articles: d.articles || 0,
            testimonials: d.testimonials || 0,
            team: d.team || 0,
            faqs: d.faqs || 0,
            proyeks: d.proyeks || 0,
            penawarans: d.penawarans || 0,
            chats: d.chats || 0,
            newMessages: d.newMessages || 0,
            recentMessages: d.recentMessages || [],
            allLeads: d.allLeads || []
          })
        }
      } catch (err) {
        console.error('Dashboard stats error:', err)
      }
    }
    fetchDashboardData()
  }, [isCustomer, isMarketing, user])

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const waNumber = "081234567890"
  const waLink = `https://wa.me/62${waNumber.slice(1)}`

  // Shared helper functions
  const statusBadge = (s) => s === 'new' ? 'badge-primary' : s === 'read' ? 'badge-ghost' : 'badge-success text-white'
  const statusLabel = (s) => s === 'new' ? 'Baru' : s === 'read' ? 'Dibaca' : 'Dibalas'

  // Shared Modal Detail Pesan
  const FormMessageModal = () => showFormModal && selectedFormMessage ? (
    <dialog className="modal modal-open">
      <div className="modal-box rounded-3xl max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 border-b border-base-200 pb-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-secondary">Detail Pesan Formulir</h3>
            <p className="text-xs text-base-content/50">Pesan kontak yang dikirim melalui formulir website</p>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-base-200/50 rounded-xl">
              <p className="text-xs text-base-content/50 mb-0.5">Pengirim</p>
              <p className="font-semibold text-secondary">{selectedFormMessage.nama}</p>
            </div>
            <div className="p-3 bg-base-200/50 rounded-xl">
              <p className="text-xs text-base-content/50 mb-0.5">Email</p>
              <p className="font-semibold text-secondary truncate">{selectedFormMessage.email}</p>
            </div>
            <div className="p-3 bg-base-200/50 rounded-xl">
              <p className="text-xs text-base-content/50 mb-0.5">No. HP</p>
              <p className="font-semibold text-secondary">{selectedFormMessage.no_hp || '-'}</p>
            </div>
            <div className="p-3 bg-base-200/50 rounded-xl">
              <p className="text-xs text-base-content/50 mb-0.5">Waktu Kirim</p>
              <p className="font-semibold text-secondary text-xs leading-relaxed">{new Date(selectedFormMessage.dikirim_pada).toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="p-3 bg-base-200/50 rounded-xl">
            <p className="text-xs text-base-content/50 mb-0.5">Subjek</p>
            <p className="font-semibold text-secondary">{selectedFormMessage.subjek}</p>
          </div>
          <div>
            <p className="text-xs text-base-content/50 mb-1.5">Isi Pesan</p>
            <div className="p-4 bg-base-200 rounded-xl whitespace-pre-line text-base-content leading-relaxed">
              {selectedFormMessage.pesan}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-base-content/50">Status:</span>
            {selectedFormMessage.status === 'new' && (
              <span className="badge badge-primary badge-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Terkirim &amp; Tersimpan
              </span>
            )}
            {selectedFormMessage.status === 'read' && <span className="badge badge-ghost badge-sm">Sudah Dibaca Tim</span>}
            {selectedFormMessage.status === 'replied' && <span className="badge badge-success text-white badge-sm">Sudah Dibalas</span>}
          </div>
        </div>
        <div className="modal-action border-t border-base-200 pt-3 mt-4">
          {hasPermission('kelola_pesan_kontak') && (
            <Link
              to="/admin/pesan-kontak"
              className="btn btn-primary btn-sm rounded-xl text-white border-none mr-auto"
              onClick={() => setShowFormModal(false)}
            >
              Kelola di Halaman Pesan
            </Link>
          )}
          <button type="button" className="btn btn-ghost btn-sm rounded-xl" onClick={() => setShowFormModal(false)}>Tutup</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={() => setShowFormModal(false)}>close</button>
      </form>
    </dialog>
  ) : null

  // ══════════════════════════════ ADMIN / MARKETING VIEW ══════════════════════════════
  if (!isCustomer) {
    const adminCards = [
      { label: 'Total Users', value: stats.users, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Roles', value: stats.roles, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Proyek', value: stats.proyeks, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Penawaran', value: stats.penawarans, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Konsultasi/Chat', value: stats.chats, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Artikel', value: stats.articles, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', color: 'text-primary bg-primary/10 border-primary/20' }
    ]

    const marketingCards = [
      { label: 'Total Obrolan Klien', value: marketingStats.totalChats, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Proyek', value: marketingStats.totalProyeks, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Total Penawaran', value: marketingStats.totalPenawarans, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Testimoni Pending', value: marketingStats.pendingTestimonials, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-primary bg-primary/10 border-primary/20' }
    ]

    const adminActions = [
      { label: 'Kelola Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-primary hover:opacity-90 text-white' },
      { label: 'Kelola Proyek', path: '/admin/proyek', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'bg-emerald-600 hover:opacity-90 text-white' },
      { label: 'Kelola Penawaran', path: '/admin/penawaran', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-amber-600 hover:opacity-90 text-white' },
      { label: 'Kelola Artikel', path: '/admin/artikel', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', color: 'bg-blue-600 hover:opacity-90 text-white' }
    ]

    const marketingActions = [
      { label: 'Kolom Chat Klien', path: '/admin/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'bg-primary hover:opacity-90 text-white' },
      { label: 'Manajemen Proyek', path: '/admin/proyek', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'bg-emerald-600 hover:opacity-90 text-white' },
      { label: 'Proposal Penawaran', path: '/admin/penawaran', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-amber-600 hover:opacity-90 text-white' },
      { label: 'Tinjau Testimoni', path: '/admin/testimoni', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'bg-indigo-600 hover:opacity-90 text-white' }
    ]

    const cards = isMarketing ? marketingCards : adminCards
    const quickActions = isMarketing ? marketingActions : adminActions
    const recentMsgs = isMarketing ? (marketingStats.recentMessages || []) : (stats.recentMessages || [])
    const newMsgCount = isMarketing
      ? recentMsgs.filter(m => m.status === 'new').length
      : (stats.newMessages || 0)

    return (
      <div className="space-y-6">
        {/* Minimalist Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-primary/5 p-5 sm:p-6 border border-primary/10">
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-secondary">
                Selamat Datang Kembali, {user?.name}!
              </h1>
              <p className="mt-1.5 text-base-content/60 max-w-xl text-sm font-normal">
                Senang melihat Anda kembali. Berikut ringkasan performa dan statistik data aplikasi Anda hari ini.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="flex items-center justify-center gap-2 bg-base-100 px-4 h-10 rounded-xl border border-base-200 text-xs font-semibold text-base-content/70 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{currentDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of Statistics */}
        <div>
          <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            Statistik Utama
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div 
                key={card.label} 
                className="group card bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="card-body p-5 flex-row items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${card.color} transition-all duration-300 group-hover:scale-110`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">{card.label}</p>
                    <p className="text-2xl font-extrabold text-base-content mt-0.5 leading-none">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRACK RECORD LEAD / CLIENT PROGRESS */}
        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="text-base font-bold text-base-content border-b border-base-200 pb-3 flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Track Record Progres Customer / Lead
            </h3>

            {/* List lead-lead tracking */}
            {((isMarketing ? marketingStats.allLeads : stats.allLeads) || []).length === 0 ? (
              <div className="text-center py-8 text-base-content/40 font-medium">Belum ada progres lead terdaftar.</div>
            ) : (
              <div className="space-y-6">
                {((isMarketing ? marketingStats.allLeads : stats.allLeads) || []).map((lead) => {
                  const stages = ['Ketertarikan', 'Ditindaklanjuti', 'Penawaran', 'Deal', 'Proses Pengerjaan', 'Selesai', 'Maintenance'];
                  const currentIndex = stages.indexOf(lead.status);
                  
                  return (
                    <div key={lead.id} className="p-5 bg-base-50 rounded-2xl border border-base-200 shadow-xs flex flex-col gap-4">
                      {/* Customer Info Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-200/50 pb-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-secondary">{lead.customer?.name}</h4>
                          <p className="text-[11px] text-base-content/50 mt-0.5">
                            Produk: <span className="font-bold text-secondary">{lead.product?.nama || 'Pertanyaan Umum'}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-base-content/40 font-bold">Marketing:</span>
                          <span className="text-[11px] font-semibold text-secondary">{lead.marketing?.name || 'Marketing Kurva'}</span>
                          
                          {/* Dropdown status update */}
                          {!isCustomer && (
                            <div className="dropdown dropdown-end ml-1">
                              <div tabIndex={0} role="button" className="btn btn-xs rounded-full border px-3 text-[10px] font-bold h-6 flex items-center gap-1.5 shadow-sm bg-white hover:bg-base-200">
                                Ubah Status
                              </div>
                              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-2xl w-48 border border-base-200 mt-1 z-[100] space-y-1">
                                {stages.map((st) => (
                                  <li key={st}>
                                    <button
                                      onClick={async () => {
                                        try {
                                          await api.put(`/chats/${lead.id}/status`, { status: st });
                                          // Refresh data
                                          window.location.reload();
                                        } catch (e) {
                                          alert('Gagal memperbarui status');
                                        }
                                      }}
                                      className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[10px] font-bold ${
                                        lead.status === st ? 'bg-base-200' : 'hover:bg-base-50'
                                      }`}
                                    >
                                      <span>{st}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bulat-bulat progress track record */}
                      <div className="w-full py-4 relative px-4 overflow-x-auto custom-scrollbar">
                        <div className="min-w-[700px] relative py-4">
                          {/* Progress Bar background line */}
                          <div className="absolute top-[28px] left-10 right-10 h-[3px] bg-base-300 rounded-full z-0">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                              style={{ width: `${(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%` }}
                            />
                          </div>
                          
                          {/* Dots */}
                          <div className="relative z-10 flex justify-between items-start w-full">
                            {stages.map((st, idx) => {
                              const active = idx <= currentIndex;
                              const isCurrent = idx === currentIndex;
                              
                              return (
                                <div key={st} className="flex flex-col items-center gap-2 group/dot relative w-20">
                                  <div 
                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 ${
                                      active 
                                        ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-500/20' 
                                        : 'bg-white text-base-content/30 border-2 border-base-300'
                                    }`}
                                  >
                                    {active ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-base-300" />
                                    )}
                                  </div>
                                  <span 
                                    className={`text-[10px] font-bold tracking-tight text-center w-full leading-tight select-none mt-1 ${
                                      isCurrent ? 'text-emerald-600 font-extrabold' : 'text-base-content/40'
                                    }`}
                                  >
                                    {st}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Account Info */}
          <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm lg:col-span-2">
            <div className="card-body p-6">
              <h3 className="text-base font-bold text-base-content border-b border-base-200 pb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informasi Akun Anda
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-2xl ring-4 ring-primary/20">
                    {user?.avatar ? (
                      <img src={`http://localhost:8000/storage/${user.avatar}`} alt={user.name} />
                    ) : (
                      <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-2xl font-black">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-sm">
                  <div className="p-3 bg-base-200/50 rounded-xl border border-base-300">
                    <p className="text-xs text-base-content/50 font-medium">Nama Lengkap</p>
                    <p className="font-semibold text-base-content mt-0.5">{user?.name}</p>
                  </div>
                  <div className="p-3 bg-base-200/50 rounded-xl border border-base-300">
                    <p className="text-xs text-base-content/50 font-medium">Alamat Email</p>
                    <p className="font-semibold text-base-content mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="p-3 bg-base-200/50 rounded-xl border border-base-300">
                    <p className="text-xs text-base-content/50 font-medium">Level Hak Akses / Roles</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user?.roles?.map((r) => (
                        <span key={r.id} className="badge badge-primary font-semibold text-xs px-2 py-1 rounded-md">
                          {r.name}
                        </span>
                      ))}
                      {(!user?.roles || user.roles.length === 0) && <span className="text-base-content/40 font-medium">-</span>}
                    </div>
                  </div>
                  <div className="p-3 bg-base-200/50 rounded-xl border border-base-300">
                    <p className="text-xs text-base-content/50 font-medium">No. Handphone</p>
                    <p className="font-semibold text-base-content mt-0.5">{user?.phone || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
            <div className="card-body p-6">
              <h3 className="text-base font-bold text-base-content border-b border-base-200 pb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Aksi Cepat
              </h3>
              
              <div className="flex flex-col gap-2.5 mt-4">
                {quickActions.map((act) => (
                  <Link 
                    key={act.label}
                    to={act.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:scale-[1.02] ${act.color}`}
                  >
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={act.icon} />
                      </svg>
                    </div>
                    <span className="font-semibold text-[13px]">{act.label}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pesan Formulir Kontak Terbaru ── */}
        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-base-content flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Pesan Formulir Kontak Terbaru
                {newMsgCount > 0 && (
                  <span className="badge badge-primary badge-xs animate-pulse">{newMsgCount} Baru</span>
                )}
              </h3>
              {hasPermission('kelola_pesan_kontak') && (
                <Link to="/admin/pesan-kontak" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Kelola Semua
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {recentMsgs.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-base-content/50">Belum ada pesan formulir masuk</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="bg-base-200/40 text-[11px] uppercase tracking-wider text-base-content/50">
                      <th>Pengirim</th>
                      <th>Subjek</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th className="w-16 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMsgs.map((msg) => (
                      <tr key={msg.id_pesan_kontak} className={`hover:bg-base-200/30 transition-colors ${msg.status === 'new' ? 'font-semibold' : ''}`}>
                        <td>
                          <div>
                            <p className="text-sm font-semibold text-base-content">{msg.nama}</p>
                            <p className="text-xs text-base-content/50">{msg.email}</p>
                          </div>
                        </td>
                        <td><span className="text-sm line-clamp-1">{msg.subjek}</span></td>
                        <td><span className={`badge badge-xs font-medium ${statusBadge(msg.status)}`}>{statusLabel(msg.status)}</span></td>
                        <td className="text-xs text-base-content/50 whitespace-nowrap">
                          {new Date(msg.dikirim_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => { setSelectedFormMessage(msg); setShowFormModal(true) }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-900/30 border border-blue-200/50 transition-all hover:scale-105"
                            title="Lihat Detail"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <FormMessageModal />
      </div>
    )
  }

  // ══════════════════════════════ CUSTOMER (PORTAL KLIEN) VIEW ══════════════════════════════
  const customerCards = [
    { label: 'Proyek Aktif', value: customerStats.activeProjects, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-primary bg-primary/10 border-primary/20' },
    { label: 'Konsultasi Diajukan', value: customerStats.consultationsCount, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-primary bg-primary/10 border-primary/20' },
    { label: 'Penawaran Pending', value: customerStats.supportTickets, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-primary bg-primary/10 border-primary/20' }
  ]

  const customerActions = [
    { label: 'Jelajahi Katalog Layanan', desc: 'Lihat area solusi pengembangan IT kami', path: '/layanan', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', bg: 'bg-white hover:border-primary/40 border-base-200' },
    { label: 'Ajukan Konsultasi Baru', desc: 'Konsultasi gratis proposal & timeline proyek', path: '/kontak', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', bg: 'bg-white hover:border-primary/40 border-base-200' },
    { label: 'Brief Proyek Baru', desc: 'Buat/ajukan brief proyek yang baru', path: '/admin/proyek', icon: 'M13 10V3L4 14h7v7l9-11h-7z', bg: 'bg-white hover:border-primary/40 border-base-200' }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary/5 p-5 sm:p-6 border border-primary/10">
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-secondary">
              Halo, {user?.name}!
            </h1>
            <p className="mt-1.5 text-base-content/60 max-w-xl text-sm font-normal">
              Selamat datang di Portal Klien CV Kurva Media Teknologi. Di sini Anda dapat melacak progress proyek, mengajukan konsultasi baru, dan mengelola informasi akun Anda.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="flex items-center justify-center gap-2 bg-base-100 px-4 h-10 rounded-xl border border-base-200 text-xs font-semibold text-base-content/70 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Customer Statistics */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          Aktivitas Portal Klien
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {customerCards.map((card) => (
            <div 
              key={card.label} 
              className="group card bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="card-body p-4 flex-row items-center gap-3">
                <div className={`p-2 rounded-xl border ${card.color} shrink-0 transition-all duration-300 group-hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider truncate">{card.label}</p>
                  <p className="text-xl font-extrabold text-base-content mt-0.5 leading-none truncate">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Action Boxes */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          Aksi Cepat Layanan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customerActions.map((act) => (
            <Link 
              key={act.label}
              to={act.path}
              className={`group relative overflow-hidden bg-base-100 border border-base-200/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col justify-between h-40`}
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={act.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-secondary group-hover:text-primary transition-colors leading-snug">{act.label}</h3>
                  <p className="text-xs text-base-content/60 mt-1 leading-relaxed">{act.desc}</p>
                </div>
              </div>
              <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Buka Menu &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Lists / Dynamic Overview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Proyek Aktif */}
        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="text-base font-bold text-base-content border-b border-base-200 pb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Daftar Layanan &amp; Proyek Aktif
            </h3>
            
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary">Belum Ada Proyek Aktif</p>
                <p className="text-xs text-base-content/50 mt-1 max-w-xs mx-auto">Silakan hubungi kami untuk mendiskusikan implementasi proyek teknologi Anda.</p>
              </div>
              <Link to="/layanan" className="btn btn-primary btn-xs rounded-lg px-3 text-white border-none mt-2">Jelajahi Solusi</Link>
            </div>
          </div>
        </div>

        {/* Tiket Dukungan */}
        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="text-base font-bold text-base-content border-b border-base-200 pb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Pertanyaan &amp; Tiket Dukungan
            </h3>
            
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary">Tidak Ada Tiket Aktif</p>
                <p className="text-xs text-base-content/50 mt-1 max-w-xs mx-auto">Butuh bantuan teknis atau maintenance sistem? Tim support kami siap membantu.</p>
              </div>
              <a href={`${waLink}?text=${encodeURIComponent('Halo tim support Kurva, saya butuh bantuan teknis.')}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-xs text-white rounded-lg px-3 border-none mt-2">Hubungi Support</a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Riwayat Pesan Formulir Kontak Anda ── */}
      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              Riwayat Pesan Formulir Kontak Anda
              {customerStats.recentMessages?.some(m => m.status === 'new') && (
                <span className="badge badge-primary badge-xs animate-pulse">Baru Terkirim</span>
              )}
            </h3>
            <Link to="/kontak" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Kirim Pesan Baru
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {!customerStats.recentMessages || customerStats.recentMessages.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-base-200/80 flex items-center justify-center text-base-content/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary">Belum Ada Pesan Terkirim</p>
                <p className="text-xs text-base-content/50 mt-1 max-w-xs mx-auto">Riwayat pesan yang Anda kirim melalui formulir kontak akan muncul di sini.</p>
              </div>
              <Link to="/kontak" className="btn btn-primary btn-xs rounded-lg px-4 text-white border-none mt-1">Kirim Pesan Sekarang</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr className="bg-base-200/40 text-[11px] uppercase tracking-wider text-base-content/50">
                    <th>Subjek</th>
                    <th>Cuplikan Pesan</th>
                    <th>Status</th>
                    <th>Tanggal Kirim</th>
                    <th className="w-16 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {customerStats.recentMessages.map((msg) => (
                    <tr key={msg.id_pesan_kontak} className={`hover:bg-base-200/30 transition-colors ${msg.status === 'new' ? 'font-semibold' : ''}`}>
                      <td><span className="text-sm text-base-content">{msg.subjek}</span></td>
                      <td><span className="text-xs text-base-content/60 line-clamp-1 max-w-[180px] block">{msg.pesan}</span></td>
                      <td>
                        <span className={`badge badge-xs font-medium ${statusBadge(msg.status)}`}>
                          {msg.status === 'new' ? '✓ Terkirim' : statusLabel(msg.status)}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/50 whitespace-nowrap">
                        {new Date(msg.dikirim_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => { setSelectedFormMessage(msg); setShowFormModal(true) }}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50 transition-all hover:scale-105"
                          title="Lihat Detail"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-base-content/40 mt-3 text-center">Menampilkan 5 pesan terbaru. Pesan formulir Anda tersimpan dan akan ditindaklanjuti oleh tim kami.</p>
            </div>
          )}
        </div>
      </div>

      <FormMessageModal />

    </div>
  )
}