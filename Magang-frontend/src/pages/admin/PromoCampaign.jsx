import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Toast from '../../components/Toast'

export default function PromoCampaign() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [judul, setJudul] = useState('')
  const [pesan, setPesan] = useState('')
  const [dokumen, setDokumen] = useState(null)
  const [customerIds, setCustomerIds] = useState([])
  const [segmentTarget, setSegmentTarget] = useState([])

  const [customers, setCustomers] = useState([])
  const [customerSearch, setCustomerSearch] = useState('')

  const [showDetail, setShowDetail] = useState(null)
  const [sending, setSending] = useState(false)

  const [toast, setToast] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const fetchCampaigns = () => {
    setLoading(true)
    api.get(`/admin/promo-campaigns?search=${search}&page=${page}`)
      .then(res => {
        setCampaigns(res.data.data || [])
        setTotalPages(res.data.last_page || 1)
      })
      .catch(() => showToastMsg('Gagal memuat data campaign.', 'error'))
      .finally(() => setLoading(false))
  }

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/users?limit=100')
      const custs = (res.data.data || []).filter(u => u.roles?.some(r => r.name === 'customer'))
      setCustomers(custs)
    } catch {}
  }

  useEffect(() => { fetchCampaigns() }, [page, search])
  useEffect(() => { fetchCustomers() }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem('promo_selected')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.customer_ids?.length) {
          setCustomerIds(data.customer_ids)
          setSegmentTarget(data.segments || [])
          setShowModal(true)
          sessionStorage.removeItem('promo_selected')
        }
      } catch {}
    }
  }, [])

  const formatTanggal = (val) => {
    if (!val) return '-'
    return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const toggleCustomer = (id) => {
    setCustomerIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const openCreate = () => {
    setJudul('')
    setPesan('')
    setDokumen(null)
    setCustomerIds([])
    setSegmentTarget([])
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!judul || !pesan || customerIds.length === 0) {
      showToastMsg('Judul, pesan, dan minimal 1 penerima wajib diisi.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('judul', judul)
    formData.append('pesan', pesan)
    if (dokumen) formData.append('dokumen', dokumen)
    customerIds.forEach(id => formData.append('customer_ids[]', id))
    segmentTarget.forEach(s => formData.append('segment_target[]', s))

    try {
      await api.post('/admin/promo-campaigns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      showToastMsg('Campaign berhasil disimpan sebagai draft.')
      setShowModal(false)
      fetchCampaigns()
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Gagal menyimpan campaign.', 'error')
    }
  }

  const handleSend = async (id) => {
    if (!window.confirm('Kirim promo ini ke semua penerima via WhatsApp?')) return
    setSending(true)
    try {
      const res = await api.post(`/admin/promo-campaigns/${id}/send`)
      showToastMsg(res.data.message || 'Promo berhasil dikirim.')
      fetchCampaigns()
      if (showDetail?.id === id) {
        const detail = await api.get(`/admin/promo-campaigns/${id}`)
        setShowDetail(detail.data)
      }
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Gagal mengirim promo.', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus campaign ini?')) return
    try {
      await api.delete(`/admin/promo-campaigns/${id}`)
      showToastMsg('Campaign berhasil dihapus.')
      fetchCampaigns()
    } catch {
      showToastMsg('Gagal menghapus campaign.', 'error')
    }
  }

  const handleShowDetail = async (id) => {
    try {
      const res = await api.get(`/admin/promo-campaigns/${id}`)
      setShowDetail(res.data)
    } catch {
      showToastMsg('Gagal memuat detail.', 'error')
    }
  }

  const filteredCustomers = customers.filter(c => {
    if (!customerSearch) return true
    return c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <Toast show={showToast && !!toast} type={toast?.type === 'error' ? 'error' : 'success'} message={toast?.msg} onClose={() => setShowToast(false)} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-secondary">Promo Campaign</h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">Kelola dan kirim promo via WhatsApp ke customer</p>
        </div>
        <button
          onClick={openCreate}
          className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90 self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Buat Campaign
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          className="input input-bordered w-full text-sm rounded-xl focus:border-primary/50 focus:outline-none"
          placeholder="Cari judul campaign..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-base-200/50 text-secondary border-b border-base-200">
                <th className="font-bold text-xs">Judul</th>
                <th className="font-bold text-xs">Dibuat Oleh</th>
                <th className="font-bold text-xs text-center">Penerima</th>
                <th className="font-bold text-xs text-center">Status</th>
                <th className="font-bold text-xs text-center">Tanggal</th>
                <th className="font-bold text-xs text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8"><span className="loading loading-spinner loading-md text-primary"></span></td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/40 font-medium">Belum ada campaign.</td></tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-base-100/50 transition-colors">
                    <td className="font-semibold text-secondary">
                      <div className="max-w-[200px] truncate" title={c.judul}>{c.judul}</div>
                      <div className="text-[10px] text-base-content/50 font-normal truncate max-w-[200px]">{c.pesan?.substring(0, 60)}...</div>
                    </td>
                    <td className="text-xs">{c.pembuat?.name || '-'}</td>
                    <td className="text-center">
                      <span className="badge bg-primary text-white border-0 font-bold text-xs rounded-md px-2.5 py-1">{c.total_penerima}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${c.status === 'terkirim' ? 'bg-emerald-500' : 'bg-amber-500'} text-white border-0 font-semibold text-xs rounded-md px-2.5 py-1 uppercase`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="text-center text-xs">{formatTanggal(c.created_at)}</td>
                    <td className="text-center">
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => handleShowDetail(c.id)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/50 transition-all duration-200 hover:scale-105" title="Detail">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {c.status === 'draft' && (
                          <button onClick={() => handleSend(c.id)} disabled={sending} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/50 transition-all duration-200 hover:scale-105" title="Kirim via WA">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                          </button>
                        )}
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/50 transition-all duration-200 hover:scale-105" title="Hapus">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-base-200 flex justify-between items-center bg-base-50">
            <span className="text-xs text-base-content/60 font-semibold">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-outline btn-xs rounded-lg font-bold">Sebelumnya</button>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-outline btn-xs rounded-lg font-bold">Selanjutnya</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-3xl max-w-2xl border border-base-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-secondary border-b border-base-200 pb-3">Buat Campaign Promo</h3>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Judul Promo <span className="text-error">*</span></span></label>
                <input type="text" className="input input-bordered rounded-xl text-sm w-full" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Diskon 20% Pembuatan Website" required />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Pesan <span className="text-error">*</span></span></label>
                <textarea className="textarea textarea-bordered rounded-xl text-sm h-28 leading-relaxed" value={pesan} onChange={(e) => setPesan(e.target.value)} placeholder={"Halo {nama_customer},\n\nKami punya penawaran spesial..."} required />
                <p className="text-[10px] text-base-content/40 mt-1">Gunakan {'{nama_customer}'} untuk personalisasi nama</p>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Upload Dokumen / Brosur (opsional)</span></label>
                <input type="file" onChange={(e) => setDokumen(e.target.files[0])} className="file-input file-input-bordered file-input-primary rounded-xl text-xs w-full" />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Penerima ({customerIds.length} dipilih) <span className="text-error">*</span></span></label>
                <input type="text" className="input input-bordered rounded-xl text-sm w-full mb-2" placeholder="Cari customer..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} />
                <div className="max-h-48 overflow-y-auto border border-base-200 rounded-xl p-2 space-y-1">
                  {filteredCustomers.map(c => (
                    <label key={c.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-base-200/50 cursor-pointer text-xs">
                      <input type="checkbox" className="checkbox checkbox-primary checkbox-xs" checked={customerIds.includes(c.id)} onChange={() => toggleCustomer(c.id)} />
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-base-content/50">{c.email}</span>
                      {!c.phone && <span className="badge badge-ghost badge-xs text-error">No WA</span>}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-action border-t border-base-200 pt-4 flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline btn-sm rounded-xl px-4 font-bold">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm rounded-xl px-4 text-white font-bold border-none">Simpan Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-3xl max-w-2xl border border-base-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-secondary border-b border-base-200 pb-3">Detail Campaign</h3>
            <div className="space-y-3 pt-4">
              <div>
                <span className="text-[10px] font-bold text-base-content/40 uppercase">Judul</span>
                <p className="font-semibold text-secondary">{showDetail.judul}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-base-content/40 uppercase">Pesan</span>
                <p className="text-sm whitespace-pre-wrap bg-base-200/30 p-3 rounded-xl">{showDetail.pesan}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-[10px] font-bold text-base-content/40 uppercase">Status</span>
                  <p><span className={`badge ${showDetail.status === 'terkirim' ? 'bg-emerald-500' : 'bg-amber-500'} text-white border-0 font-semibold text-xs rounded-md px-2.5 py-1 uppercase`}>{showDetail.status}</span></p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-base-content/40 uppercase">Total Penerima</span>
                  <p className="font-bold text-secondary">{showDetail.total_penerima}</p>
                </div>
                {showDetail.dokumen_path && (
                  <div>
                    <span className="text-[10px] font-bold text-base-content/40 uppercase">Dokumen</span>
                    <p><a href={`http://localhost:8000/storage/${showDetail.dokumen_path}`} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-xs hover:underline">Download</a></p>
                  </div>
                )}
              </div>

              {showDetail.logs?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-base-content/40 uppercase">Log Pengiriman</span>
                  <div className="overflow-x-auto mt-1">
                    <table className="table table-zebra w-full text-xs">
                      <thead>
                        <tr className="bg-base-200/50">
                          <th className="font-bold">Customer</th>
                          <th className="font-bold">No. WA</th>
                          <th className="font-bold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showDetail.logs.map(log => (
                          <tr key={log.id}>
                            <td>{log.customer?.name || '-'}</td>
                            <td>{log.nomor_wa || '-'}</td>
                            <td className="text-center">
                              <span className={`badge ${log.status_kirim === 'terkirim' ? 'bg-emerald-500' : log.status_kirim === 'gagal' ? 'bg-rose-500' : 'bg-amber-500'} text-white border-0 font-semibold text-[10px] rounded-md px-2 py-0.5 uppercase`}>
                                {log.status_kirim}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-action border-t border-base-200 pt-4">
              {showDetail.status === 'draft' && (
                <button onClick={() => { handleSend(showDetail.id); }} disabled={sending} className="btn btn-primary btn-sm rounded-xl px-4 text-white font-bold border-none gap-1">
                  {sending ? <span className="loading loading-spinner loading-xs"></span> : null}
                  Kirim via WhatsApp
                </button>
              )}
              <button onClick={() => setShowDetail(null)} className="btn btn-outline btn-sm rounded-xl px-4 font-bold">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
