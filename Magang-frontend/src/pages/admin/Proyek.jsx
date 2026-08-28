import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/useAuth'
import AjukanProyek from './AjukanProyek'

export default function Proyek() {
  const { user, hasPermission } = useAuth()
  const isMarketingOrAdmin = hasPermission('kelola_proyek')
  const isCustomer = user?.roles?.some(role => role.name === 'customer')

  const [proyeks, setProyeks] = useState([])
  const [activeProyek, setActiveProyek] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('list') // 'list', 'detail'
  const [showAjukanModal, setShowAjukanModal] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  // Admin/Marketing action states
  const [statusInput, setStatusInput] = useState('planning')
  const [tanggalMulaiInput, setTanggalMulaiInput] = useState('')
  const [tanggalSelesaiInput, setTanggalSelesaiInput] = useState('')
  const [isEditingKontrak, setIsEditingKontrak] = useState(false)
  
  // Timeline management states
  const [newMilestoneJudul, setNewMilestoneJudul] = useState('')
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('')
  const [newMilestoneDate, setNewMilestoneDate] = useState('')
  const [newMilestoneSelesai, setNewMilestoneSelesai] = useState(false)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)

  // Dokumentasi upload states
  const [docFile, setDocFile] = useState(null)
  const [docKet, setDocKet] = useState('')
  const [uploadingDoc, setUploadingDoc] = useState(false)

  const fetchProyeks = async (selectId = null) => {
    setLoading(true)
    try {
      const res = await api.get('/proyek')
      const data = res.data.data || []
      setProyeks(data)
      if (selectId) {
        const found = data.find(p => p.id === selectId)
        if (found) {
          setActiveProyek(found)
          setStatusInput(found.status_proyek)
          setTanggalMulaiInput(found.tanggal_mulai || '')
          setTanggalSelesaiInput(found.tanggal_selesai || '')
          setIsEditingKontrak(false)
          setIsAddingMilestone(false)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProyeks()
  }, [])

  const handleSelectProyek = (proj) => {
    setActiveProyek(proj)
    setStatusInput(proj.status_proyek)
    setTanggalMulaiInput(proj.tanggal_mulai || '')
    setTanggalSelesaiInput(proj.tanggal_selesai || '')
    setIsEditingKontrak(false)
    setIsAddingMilestone(false)
    setMode('detail')
  }

  // Update proyek progress & status & timeline
  const handleUpdateProyek = async (e) => {
    e.preventDefault()
    if (!activeProyek) return

    // Tentukan progress secara otomatis berdasarkan status proyek
    let calculatedProgress = 0
    if (statusInput === 'planning') calculatedProgress = 20
    else if (statusInput === 'on progress') calculatedProgress = 50
    else if (statusInput === 'testing') calculatedProgress = 80
    else if (statusInput === 'selesai') calculatedProgress = 100

    try {
      const res = await api.put(`/proyek/${activeProyek.id}`, {
        nama_proyek: activeProyek.nama_proyek,
        deskripsi_kebutuhan: activeProyek.deskripsi_kebutuhan,
        progress: calculatedProgress,
        status_proyek: statusInput,
        tanggal_mulai: tanggalMulaiInput,
        tanggal_selesai: tanggalSelesaiInput,
        timeline: activeProyek.timeline // Mengirimkan timeline saat ini
      })
      alert('Proyek berhasil diperbarui!')
      setActiveProyek(res.data)
      fetchProyeks(res.data.id)
    } catch (err) {
      console.error(err)
      alert('Gagal memperbarui proyek.')
    }
  }

  // Add timeline milestone
  const handleAddMilestone = async (e) => {
    e.preventDefault()
    if (!newMilestoneJudul || !newMilestoneDate) {
      alert('Harap isi judul milestone dan tanggal.')
      return
    }

    const updatedTimeline = [...(activeProyek.timeline || [])]
    updatedTimeline.push({
      judul: newMilestoneJudul,
      deskripsi: newMilestoneDesc,
      tanggal: newMilestoneDate,
      selesai: newMilestoneSelesai
    })

    try {
      const res = await api.put(`/proyek/${activeProyek.id}`, {
        nama_proyek: activeProyek.nama_proyek,
        deskripsi_kebutuhan: activeProyek.deskripsi_kebutuhan,
        progress: activeProyek.progress,
        status_proyek: activeProyek.status_proyek,
        tanggal_mulai: activeProyek.tanggal_mulai,
        tanggal_selesai: activeProyek.tanggal_selesai,
        timeline: updatedTimeline
      })
      setActiveProyek(res.data)
      setNewMilestoneJudul('')
      setNewMilestoneDesc('')
      setNewMilestoneDate('')
      setNewMilestoneSelesai(false)
      setIsAddingMilestone(false)
      fetchProyeks(res.data.id)
    } catch (err) {
      console.error(err)
      alert('Gagal menambah milestone.')
    }
  }

  // Toggle milestone status
  const handleToggleMilestone = async (index) => {
    const updatedTimeline = [...(activeProyek.timeline || [])]
    updatedTimeline[index].selesai = !updatedTimeline[index].selesai

    try {
      const res = await api.put(`/proyek/${activeProyek.id}`, {
        nama_proyek: activeProyek.nama_proyek,
        deskripsi_kebutuhan: activeProyek.deskripsi_kebutuhan,
        progress: activeProyek.progress,
        status_proyek: activeProyek.status_proyek,
        tanggal_mulai: activeProyek.tanggal_mulai,
        tanggal_selesai: activeProyek.tanggal_selesai,
        timeline: updatedTimeline
      })
      setActiveProyek(res.data)
      fetchProyeks(res.data.id)
    } catch (err) {
      console.error(err)
    }
  }

  // Remove milestone
  const handleRemoveMilestone = async (index) => {
    if (!window.confirm('Hapus milestone ini?')) return
    const updatedTimeline = [...(activeProyek.timeline || [])]
    updatedTimeline.splice(index, 1)

    try {
      const res = await api.put(`/proyek/${activeProyek.id}`, {
        nama_proyek: activeProyek.nama_proyek,
        deskripsi_kebutuhan: activeProyek.deskripsi_kebutuhan,
        progress: activeProyek.progress,
        status_proyek: activeProyek.status_proyek,
        tanggal_mulai: activeProyek.tanggal_mulai,
        tanggal_selesai: activeProyek.tanggal_selesai,
        timeline: updatedTimeline
      })
      setActiveProyek(res.data)
      fetchProyeks(res.data.id)
    } catch (err) {
      console.error(err)
    }
  }

  // Upload Dokumentasi / Berkas Hasil Proyek
  const handleUploadDokumentasi = async (e) => {
    e.preventDefault()
    if (!docFile || !docKet.trim()) return

    setUploadingDoc(true)
    const formData = new FormData()
    formData.append('file', docFile)
    formData.append('keterangan', docKet)

    try {
      const res = await api.post(`/proyek/${activeProyek.id}/dokumentasi`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setActiveProyek(res.data)
      setDocFile(null)
      setDocKet('')
      const fileInput = document.getElementById('doc-file-input')
      if (fileInput) fileInput.value = ''
      fetchProyeks(res.data.id)
      alert('Dokumen pengerjaan berhasil diunggah!')
    } catch (err) {
      console.error(err)
      alert('Gagal mengunggah berkas.')
    } finally {
      setUploadingDoc(false)
    }
  }

  // Delete Dokumentasi
  const handleDeleteDokumentasi = async (dokumenId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen hasil ini?')) return
    try {
      const res = await api.delete(`/proyek/${activeProyek.id}/dokumentasi/${dokumenId}`)
      setActiveProyek(res.data)
      fetchProyeks(res.data.id)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus berkas.')
    }
  }

  const handleDeleteProyek = async (id) => {
    if (!window.confirm('Hapus proyek ini secara permanen?')) return
    try {
      await api.delete(`/proyek/${id}`)
      setActiveProyek(null)
      setMode('list')
      fetchProyeks()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-secondary">
            {mode === 'detail' ? `Detail: ${activeProyek?.nama_proyek}` : 'Proyek Saya'}
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            {mode === 'detail' 
              ? 'Pantau progress jasa digital Anda: tahapan, berkas hasil, dan catatan revisi.'
              : 'Daftar pengerjaan proyek sistem informasi dan konsultasi digital Anda.'}
          </p>
        </div>

        {mode === 'list' && isCustomer && (
          <button
            onClick={() => setShowAjukanModal(true)}
            className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajukan Proyek</span>
          </button>
        )}

        {mode === 'detail' && (
          <button
            onClick={() => {
              setActiveProyek(null)
              setMode('list')
            }}
            className="btn btn-sm rounded-xl bg-white border border-[#DCE6E1] text-secondary hover:bg-base-100 hover:border-primary/40 font-semibold gap-2 px-4 shadow-xs transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Daftar</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : mode === 'list' ? (
        /* ════════════════════ LIST VIEW ════════════════════ */
        proyeks.length === 0 ? (
          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-3xl p-12 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-secondary">Belum ada proyek</h3>
            <p className="text-xs text-base-content/65 leading-relaxed max-w-xs mx-auto">
              Ajukan brief lewat formulir, lalu tim kami akan membuka ruang proyek untuk Anda.
            </p>
            {isCustomer && (
              <button
                onClick={() => setShowAjukanModal(true)}
                className="btn btn-primary btn-sm rounded-xl gap-2 px-4 text-white border-none shadow-sm font-semibold transition-all duration-200 hover:opacity-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Ajukan Proyek</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {proyeks.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleSelectProyek(proj)}
                className="group card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer rounded-3xl p-5 flex flex-col justify-between h-56 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {proj.layanan?.title || 'Kustom TI'}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                      proj.status_proyek === 'selesai' ? 'bg-emerald-100 text-emerald-700' :
                      proj.status_proyek === 'pengajuan' ? 'bg-amber-100 text-amber-700' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {proj.status_proyek}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-secondary group-hover:text-primary transition-colors text-sm line-clamp-2 leading-snug">
                    {proj.nama_proyek}
                  </h3>
                  <p className="text-[11px] text-base-content/60 line-clamp-3 leading-relaxed">
                    {proj.deskripsi_kebutuhan}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-base-200">
                  <div className="flex justify-between items-center text-[10px] font-bold text-base-content/50">
                    <span>Progress Pengerjaan</span>
                    <span className="text-secondary font-mono">{proj.progress}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-1.5"
                    value={proj.progress}
                    max="100"
                  ></progress>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ════════════════════ DETAIL VIEW ════════════════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: MONITORING PROGRESS & TIMELINE */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Progress Card */}
            <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase">
                    {activeProyek.layanan?.title || 'Pengembangan Custom'}
                  </span>
                  <h2 className="font-extrabold text-secondary text-base sm:text-lg leading-tight mt-0.5">
                    Progress Pengerjaan Proyek
                  </h2>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                  activeProyek.status_proyek === 'selesai' ? 'bg-emerald-150 text-emerald-800' :
                  activeProyek.status_proyek === 'pengajuan' ? 'bg-amber-100 text-amber-700' :
                  'bg-primary/10 text-primary'
                }`}>
                  {activeProyek.status_proyek}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-base-content/50">Tahapan Saat Ini</span>
                  <span className="text-xl font-black text-primary font-mono">{activeProyek.progress}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full h-3 rounded-full"
                  value={activeProyek.progress}
                  max="100"
                ></progress>
              </div>

              <div className="text-xs text-base-content/75 leading-relaxed bg-base-50 p-4 rounded-2xl border border-base-200/55">
                <p className="font-bold text-secondary mb-1">Brief Kebutuhan:</p>
                <p className="whitespace-pre-wrap">{activeProyek.deskripsi_kebutuhan}</p>
              </div>

              {/* Kontrak Waktu Proyek */}
              <div className="grid grid-cols-2 gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/10 relative">
                <div>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase">Tanggal Mulai Proyek</p>
                  <p className="text-sm font-bold text-secondary mt-0.5">
                    {activeProyek.tanggal_mulai 
                      ? new Date(activeProyek.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Belum ditentukan'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase">Target Serah Terima</p>
                  <p className="text-sm font-bold text-secondary mt-0.5">
                    {activeProyek.tanggal_selesai 
                      ? new Date(activeProyek.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Belum ditentukan'}
                  </p>
                </div>
                
                {isMarketingOrAdmin && (activeProyek.tanggal_mulai || activeProyek.tanggal_selesai) && (
                  <button 
                    onClick={() => setIsEditingKontrak(!isEditingKontrak)}
                    className="absolute top-3 right-3 btn btn-xs rounded-xl bg-white border border-[#DCE6E1] hover:border-primary/40 hover:bg-primary/5 text-primary text-xs font-semibold px-3 h-7 shadow-xs transition-all"
                  >
                    {isEditingKontrak ? 'Batal' : 'Edit Kontrak'}
                  </button>
                )}
              </div>

              {isMarketingOrAdmin && (
                <div className="pt-4 border-t border-base-200 space-y-6">
                  {/* Form Kontrak Waktu Proyek */}
                  {(!activeProyek.tanggal_mulai || !activeProyek.tanggal_selesai || isEditingKontrak) && (
                    <form onSubmit={handleUpdateProyek} className="bg-base-200/40 p-4 rounded-2xl border border-base-300 flex flex-col gap-3">
                      <h4 className="font-bold text-xs text-secondary flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Atur Kontrak Waktu Proyek
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label py-0.5"><span className="label-text text-[10px] font-bold text-secondary">Tanggal Mulai</span></label>
                          <input 
                            type="date" 
                            className="input input-bordered rounded-xl text-xs w-full focus:outline-none bg-white"
                            value={tanggalMulaiInput}
                            onChange={(e) => setTanggalMulaiInput(e.target.value)}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-0.5"><span className="label-text text-[10px] font-bold text-secondary">Tanggal Target Selesai</span></label>
                          <input 
                            type="date" 
                            className="input input-bordered rounded-xl text-xs w-full focus:outline-none bg-white"
                            value={tanggalSelesaiInput}
                            onChange={(e) => setTanggalSelesaiInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-sm rounded-xl text-white font-semibold border-none shadow-sm gap-1.5 px-4 transition-all hover:opacity-90"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Simpan Kontrak Waktu</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Form Update Progres & Status */}
                  <form onSubmit={handleUpdateProyek} className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex flex-col gap-3">
                    <h4 className="font-bold text-xs text-secondary flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Update Status Progres
                    </h4>
                    <div className="form-control">
                      <label className="label py-0.5"><span className="label-text text-[10px] font-bold text-secondary">Status Proyek</span></label>
                      <select
                        className="select select-bordered rounded-xl text-xs w-full focus:outline-none bg-white"
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        required
                      >
                        <option value="pengajuan">Pengajuan</option>
                        <option value="planning">Planning</option>
                        <option value="on progress">On Progress</option>
                        <option value="testing">Testing</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </div>
                    <div className="flex justify-end mt-1">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-sm rounded-xl text-white font-semibold border-none shadow-sm gap-1.5 px-4 transition-all hover:opacity-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Simpan Status Proyek</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Timeline Milestone Card */}
            <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-5 shadow-sm">
              <div className="flex justify-between items-center border-b border-base-200 pb-3">
                <h3 className="font-extrabold text-secondary text-sm sm:text-base">
                  Timeline & Milestone Proyek
                </h3>
                {isMarketingOrAdmin && (
                  <button
                    onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5 px-3.5 text-white border-none shadow-sm font-semibold transition-all hover:opacity-90"
                  >
                    {isAddingMilestone ? (
                      <span>Batal</span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tambah Milestone</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4 pl-2">
                {(!activeProyek.timeline || activeProyek.timeline.length === 0) ? (
                  <p className="text-xs text-base-content/40 italic">Timeline pengerjaan belum ditambahkan.</p>
                ) : (
                  activeProyek.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative group">
                      {/* Line connector */}
                      {idx !== activeProyek.timeline.length - 1 && (
                        <div className="absolute left-[9px] top-6 w-[2px] h-[calc(100%+8px)] bg-base-200"></div>
                      )}

                      <div
                        onClick={() => { if (isMarketingOrAdmin) handleToggleMilestone(idx); }}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                          item.selesai
                            ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20'
                            : 'bg-white border-base-300'
                        }`}
                      >
                        {item.selesai && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-secondary truncate">{item.judul}</h4>
                          <span className="text-[10px] text-base-content/40 font-mono shrink-0">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/60 leading-relaxed mt-0.5">{item.deskripsi}</p>
                        {isMarketingOrAdmin && (
                          <button
                            onClick={() => handleRemoveMilestone(idx)}
                            className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-700 hover:underline mt-1.5 font-semibold transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Hapus Milestone</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isMarketingOrAdmin && isAddingMilestone && (
                <form onSubmit={handleAddMilestone} className="pt-5 border-t border-base-200 space-y-4 bg-[#fbfdfc] p-5 rounded-2xl border border-primary/10">
                  <h4 className="font-bold text-xs text-secondary flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tambah Milestone Baru
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label py-0.5"><span className="label-text text-[10px] font-bold text-secondary">Judul Milestone <span className="text-error">*</span></span></label>
                      <input
                        type="text"
                        placeholder="Contoh: Desain Figma Disetujui"
                        className="input input-bordered rounded-xl text-xs w-full focus:outline-none bg-base-100 border-base-200"
                        value={newMilestoneJudul}
                        onChange={(e) => setNewMilestoneJudul(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label py-0.5"><span className="label-text text-[10px] font-bold text-secondary">Tanggal Target <span className="text-error">*</span></span></label>
                      <input
                        type="date"
                        className="input input-bordered rounded-xl text-xs w-full focus:outline-none bg-base-100 border-base-200"
                        value={newMilestoneDate}
                        onChange={(e) => setNewMilestoneDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label py-0.5"><span className="label-text text-[10px] font-bold text-secondary">Keterangan / Catatan</span></label>
                    <textarea
                      placeholder="Detail mengenai target milestone..."
                      className="textarea textarea-bordered rounded-xl text-xs h-20 leading-relaxed focus:outline-none bg-base-100 border-base-200"
                      value={newMilestoneDesc}
                      onChange={(e) => setNewMilestoneDesc(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-secondary">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm rounded"
                        checked={newMilestoneSelesai}
                        onChange={(e) => setNewMilestoneSelesai(e.target.checked)}
                      />
                      Langsung tandai selesai
                    </label>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-sm rounded-xl text-white font-semibold border-none shadow-sm gap-1.5 px-4 transition-all hover:opacity-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Simpan Milestone</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT: DOKUMENTASI / BERKAS HASIL */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dokumentasi List */}
            <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-secondary text-sm border-b border-base-200 pb-3">
                Dokumentasi & Lampiran
              </h3>

              <div className="space-y-3">
                {(!activeProyek.dokumentasi || activeProyek.dokumentasi.length === 0) ? (
                  <div className="text-center py-6 text-base-content/40 space-y-1">
                    <p className="text-[11px] font-bold">Belum ada berkas</p>
                    <p className="text-[10px] leading-relaxed">Hasil pengerjaan / SkPL akan diunggah di sini.</p>
                  </div>
                ) : (
                  activeProyek.dokumentasi.map((doc) => (
                    <div key={doc.id} className="p-3 bg-base-50 border border-base-200/50 rounded-2xl flex flex-col gap-1.5 shadow-[0_1px_5px_rgba(0,0,0,0.01)]">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-secondary truncate" title={doc.file_name}>
                            {doc.file_name}
                          </p>
                          <p className="text-[9px] text-base-content/50 mt-0.5 font-medium leading-relaxed">
                            {doc.keterangan}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-base-content/40 border-t border-base-200/40 pt-2 mt-1">
                        <span>{new Date(doc.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        <div className="flex items-center gap-2 font-bold">
                          {isMarketingOrAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteDokumentasi(doc.id)}
                              className="text-error hover:underline"
                            >
                              Hapus
                            </button>
                          )}
                          <a
                            href={`http://localhost:8000/storage/${doc.file_path}`}
                            download={doc.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Download &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isMarketingOrAdmin && (
                <form onSubmit={handleUploadDokumentasi} className="pt-4 border-t border-base-200 space-y-3">
                  <h4 className="font-bold text-xs text-secondary">Unggah Berkas Baru</h4>
                  <div className="form-control">
                    <input
                      type="file"
                      id="doc-file-input"
                      onChange={(e) => setDocFile(e.target.files[0])}
                      className="file-input file-input-bordered file-input-primary file-input-xs rounded-xl w-full text-[11px]"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <input
                      type="text"
                      placeholder="Keterangan berkas..."
                      className="input input-bordered input-xs rounded-xl text-xs w-full focus:outline-none"
                      value={docKet}
                      onChange={(e) => setDocKet(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingDoc || !docFile || !docKet.trim()}
                    className="btn btn-primary btn-sm w-full text-white font-semibold rounded-xl border-none shadow-sm gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {uploadingDoc ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Unggah Berkas</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Admin Delete Proyek */}
            {isMarketingOrAdmin && (
              <button
                onClick={() => handleDeleteProyek(activeProyek.id)}
                className="btn btn-sm w-full mt-4 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30 border border-rose-200/80 hover:border-rose-300 font-semibold rounded-xl justify-center gap-2 transition-all duration-200 shadow-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus Proyek Secara Permanen</span>
              </button>
            )}

          </div>

        </div>
      )}

      {/* ── POPUP MODAL: AJUKAN PROYEK (CUSTOMER) ── */}
      <AjukanProyek
        isOpen={showAjukanModal}
        onClose={() => setShowAjukanModal(false)}
        onSaved={() => {
          setShowAjukanModal(false)
          fetchProyeks()
          showToast('Pengajuan proyek berhasil dikirim! Tim kami akan segera meninjau.')
        }}
      />

      {/* ── TOAST NOTIFICATION ── */}
      {toast.show && (
        <div className="toast toast-end toast-bottom z-[9999] p-4">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} text-white shadow-xl rounded-2xl flex items-center gap-2 border-none`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
