import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Toast from '../../components/Toast'

export default function BroadcastMaintenance() {
  const [broadcasts, setBroadcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [judul, setJudul] = useState('')
  const [pesan, setPesan] = useState('')
  const [jenis, setJenis] = useState('info')
  const [target, setTarget] = useState('semua_customer')
  const [proyekId, setProyekId] = useState('')
  const [aktifDari, setAktifDari] = useState('')
  const [aktifSampai, setAktifSampai] = useState('')
  const [kanal, setKanal] = useState('keduanya')

  const [proyeks, setProyeks] = useState([])
  const [sending, setSending] = useState(false)

  const [toast, setToast] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const formatTanggal = (val) => {
    if (!val) return '-'
    return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const fetchBroadcasts = () => {
    setLoading(true)
    api.get(`/admin/broadcast-maintenance?search=${search}&page=${page}`)
      .then(res => {
        setBroadcasts(res.data.data || [])
        setTotalPages(res.data.last_page || 1)
      })
      .catch(() => showToastMsg('Gagal memuat data broadcast.', 'error'))
      .finally(() => setLoading(false))
  }

  const fetchProyeks = async () => {
    try {
      const res = await api.get('/proyek?limit=100')
      setProyeks(res.data.data || [])
    } catch {}
  }

  useEffect(() => { fetchBroadcasts() }, [page, search])
  useEffect(() => { fetchProyeks() }, [])

  const openCreate = () => {
    setEditId(null)
    setJudul('')
    setPesan('')
    setJenis('info')
    setTarget('semua_customer')
    setProyekId('')
    setAktifDari('')
    setAktifSampai('')
    setKanal('keduanya')
    setShowModal(true)
  }

  const openEdit = (b) => {
    setEditId(b.id)
    setJudul(b.judul)
    setPesan(b.pesan)
    setJenis(b.jenis)
    setTarget(b.target)
    setProyekId(b.proyek_id || '')
    setAktifDari(b.aktif_dari ? b.aktif_dari.slice(0, 16) : '')
    setAktifSampai(b.aktif_sampai ? b.aktif_sampai.slice(0, 16) : '')
    setKanal(b.kanal || 'keduanya')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { judul, pesan, jenis, target, proyek_id: target === 'per_proyek' ? proyekId : null, aktif_dari: aktifDari, aktif_sampai: aktifSampai, kanal }

    try {
      if (editId) {
        await api.put(`/admin/broadcast-maintenance/${editId}`, data)
        showToastMsg('Broadcast berhasil diperbarui.')
      } else {
        await api.post('/admin/broadcast-maintenance', data)
        showToastMsg('Broadcast berhasil disimpan.')
      }
      setShowModal(false)
      fetchBroadcasts()
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Gagal menyimpan broadcast.', 'error')
    }
  }

  const handlePublish = async (id) => {
    if (!window.confirm('Publikasikan broadcast ini ke web (dashboard customer)?')) return
    setSending(true)
    try {
      const res = await api.post(`/admin/broadcast-maintenance/${id}/publish`)
      showToastMsg(res.data.message || 'Broadcast dipublikasikan di web.')
      fetchBroadcasts()
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Gagal mempublikasikan broadcast.', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleUnpublish = async (id) => {
    if (!window.confirm('Tarik broadcast ini dari web?')) return
    setSending(true)
    try {
      const res = await api.post(`/admin/broadcast-maintenance/${id}/unpublish`)
      showToastMsg(res.data.message || 'Broadcast ditarik dari web.')
      fetchBroadcasts()
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Gagal menarik broadcast.', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleSend = async (id) => {
    if (!window.confirm('Kirim broadcast ini ke customer via WhatsApp?')) return
    setSending(true)
    try {
      const res = await api.post(`/admin/broadcast-maintenance/${id}/send`)
      showToastMsg(res.data.message || 'Broadcast berhasil dikirim.')
      fetchBroadcasts()
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Gagal mengirim broadcast.', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus broadcast ini?')) return
    try {
      await api.delete(`/admin/broadcast-maintenance/${id}`)
      showToastMsg('Broadcast berhasil dihapus.')
      fetchBroadcasts()
    } catch {
      showToastMsg('Gagal menghapus broadcast.', 'error')
    }
  }

  const jenisColors = { maintenance: 'bg-amber-500', trouble: 'bg-rose-500', info: 'bg-blue-500' }
  const kanalLabels = { web: 'Web', wa: 'WhatsApp', keduanya: 'Web + WA' }

  return (
    <div className="space-y-6">
      <Toast show={showToast && !!toast} type={toast?.type === 'error' ? 'error' : 'success'} message={toast?.msg} onClose={() => setShowToast(false)} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-secondary">Broadcast Maintenance</h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">Kirim pemberitahuan maintenance, trouble, atau info ke customer via Web dan/atau WhatsApp</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90 self-start sm:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Buat Broadcast
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" className="input input-bordered w-full text-sm rounded-xl focus:border-primary/50 focus:outline-none" placeholder="Cari judul broadcast..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
      </div>

      <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-base-200/50 text-secondary border-b border-base-200">
                <th className="font-bold text-xs">Judul</th>
                <th className="font-bold text-xs text-center">Jenis</th>
                <th className="font-bold text-xs text-center">Target</th>
                <th className="font-bold text-xs text-center">Kanal</th>
                <th className="font-bold text-xs text-center">Aktif</th>
                <th className="font-bold text-xs text-center">Status</th>
                <th className="font-bold text-xs text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8"><span className="loading loading-spinner loading-md text-primary"></span></td></tr>
              ) : broadcasts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-base-content/40 font-medium">Belum ada broadcast.</td></tr>
              ) : (
                broadcasts.map(b => (
                  <tr key={b.id} className="hover:bg-base-100/50 transition-colors">
                    <td className="font-semibold text-secondary">
                      <div className="max-w-[200px] truncate" title={b.judul}>{b.judul}</div>
                      <div className="text-[10px] text-base-content/50 font-normal truncate max-w-[200px]">{b.pesan?.substring(0, 50)}...</div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${jenisColors[b.jenis] || 'bg-gray-400'} text-white border-0 font-semibold text-[10px] rounded-md px-2 py-0.5 uppercase`}>{b.jenis}</span>
                    </td>
                    <td className="text-center text-xs">
                      {b.target === 'semua_customer' ? 'Semua Customer' : (
                        <span className="text-[10px]">{b.proyek?.nama_proyek || 'Per Proyek'}</span>
                      )}
                    </td>
                    <td className="text-center">
                      <span className="badge bg-base-300 text-base-content border-0 font-semibold text-[10px] rounded-md px-2 py-0.5">{kanalLabels[b.kanal] || b.kanal}</span>
                    </td>
                    <td className="text-center text-[10px]">
                      <div>{formatTanggal(b.aktif_dari)}</div>
                      <div className="text-base-content/40">s/d</div>
                      <div>{formatTanggal(b.aktif_sampai)}</div>
                    </td>
                    <td className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {b.is_published_web ? (
                          <span className="badge bg-emerald-500 text-white border-0 font-semibold text-[10px] rounded-md px-2 py-0.5">Aktif di Web</span>
                        ) : (
                          <span className="badge bg-base-300 text-base-content/60 border-0 font-semibold text-[10px] rounded-md px-2 py-0.5">Di Web: -</span>
                        )}
                        {b.total_penerima !== null && b.total_penerima !== undefined ? (
                          <span className="badge bg-sky-500 text-white border-0 font-semibold text-[10px] rounded-md px-2 py-0.5">WA: {b.total_penerima}</span>
                        ) : (
                          <span className="badge bg-base-300 text-base-content/60 border-0 font-semibold text-[10px] rounded-md px-2 py-0.5">WA: -</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200/50 transition-all duration-200 hover:scale-105" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        {/* Tombol Web: publish/unpublish */}
                        {!b.is_published_web ? (
                          <button onClick={() => handlePublish(b.id)} disabled={sending} className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200/50 transition-all duration-200 hover:scale-105" title="Publikasikan ke Web">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                          </button>
                        ) : (
                          <button onClick={() => handleUnpublish(b.id)} disabled={sending} className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200/50 transition-all duration-200 hover:scale-105" title="Tarik dari Web">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          </button>
                        )}
                        {/* Tombol WA: hanya jika kanal mendukung */}
                        {(b.kanal === 'wa' || b.kanal === 'keduanya') && b.total_penerima === null && (
                          <button onClick={() => handleSend(b.id)} disabled={sending} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/50 transition-all duration-200 hover:scale-105" title="Kirim via WA">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                          </button>
                        )}
                        <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/50 transition-all duration-200 hover:scale-105" title="Hapus">
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
          <div className="modal-box rounded-3xl max-w-lg border border-base-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-secondary border-b border-base-200 pb-3">
              {editId ? 'Edit Broadcast' : 'Buat Broadcast Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Judul <span className="text-error">*</span></span></label>
                <input type="text" className="input input-bordered rounded-xl text-sm w-full" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Server Maintenance" required />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Pesan <span className="text-error">*</span></span></label>
                <textarea className="textarea textarea-bordered rounded-xl text-sm h-24 leading-relaxed" value={pesan} onChange={(e) => setPesan(e.target.value)} placeholder="Detail pemberitahuan..." required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1"><span className="text-xs font-bold text-secondary">Jenis <span className="text-error">*</span></span></label>
                  <select className="select select-bordered rounded-xl text-sm" value={jenis} onChange={(e) => setJenis(e.target.value)}>
                    <option value="info">Info</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="trouble">Trouble</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="text-xs font-bold text-secondary">Target <span className="text-error">*</span></span></label>
                  <select className="select select-bordered rounded-xl text-sm" value={target} onChange={(e) => setTarget(e.target.value)}>
                    <option value="semua_customer">Semua Customer</option>
                    <option value="per_proyek">Per Proyek</option>
                  </select>
                </div>
              </div>

              {target === 'per_proyek' && (
                <div className="form-control">
                  <label className="label py-1"><span className="text-xs font-bold text-secondary">Proyek <span className="text-error">*</span></span></label>
                  <select className="select select-bordered rounded-xl text-sm" value={proyekId} onChange={(e) => setProyekId(e.target.value)} required>
                    <option value="">Pilih Proyek</option>
                    {proyeks.map(p => (
                      <option key={p.id} value={p.id}>{p.nama_proyek} - {p.customer?.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pilihan Kanal Pengiriman */}
              <div className="form-control">
                <label className="label py-1"><span className="text-xs font-bold text-secondary">Kanal Pengiriman <span className="text-error">*</span></span></label>
                <div className="flex gap-2">
                  {[
                    { value: 'web', label: 'Web Saja', desc: 'Muncul di dashboard customer' },
                    { value: 'wa', label: 'WA Saja', desc: 'Kirim via WhatsApp' },
                    { value: 'keduanya', label: 'Web + WA', desc: 'Keduanya' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex-1 cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-200 ${kanal === opt.value ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-base-300'}`}>
                      <input type="radio" name="kanal" value={opt.value} checked={kanal === opt.value} onChange={(e) => setKanal(e.target.value)} className="sr-only" />
                      <div className={`text-xs font-bold ${kanal === opt.value ? 'text-primary' : 'text-base-content/70'}`}>{opt.label}</div>
                      <div className="text-[10px] text-base-content/40 mt-0.5">{opt.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1"><span className="text-xs font-bold text-secondary">Aktif Dari <span className="text-error">*</span></span></label>
                  <input type="datetime-local" className="input input-bordered rounded-xl text-sm" value={aktifDari} onChange={(e) => setAktifDari(e.target.value)} required />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="text-xs font-bold text-secondary">Aktif Sampai <span className="text-error">*</span></span></label>
                  <input type="datetime-local" className="input input-bordered rounded-xl text-sm" value={aktifSampai} onChange={(e) => setAktifSampai(e.target.value)} required />
                </div>
              </div>

              <div className="modal-action border-t border-base-200 pt-4 flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline btn-sm rounded-xl px-4 font-bold">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm rounded-xl px-4 text-white font-bold border-none">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
