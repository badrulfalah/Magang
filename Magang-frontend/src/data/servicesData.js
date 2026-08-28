export const serviceCategories = [
  {
    id: 'web-development',
    slug: 'web-development',
    name: 'Pengembangan Perangkat Lunak',
    subtitle: 'Website, web app, sistem bisnis, dan e-commerce.',
    description: 'Company profile hingga web app custom yang cepat, aman, dan scalable.',
    itemsCount: '4 solusi dalam kategori ini',
    iconId: 'code',
    items: [
      { id: '1', num: '01', title: 'Company Profile', badge: 'UNGGULAN', desc: 'Website profil perusahaan profesional untuk meningkatkan kredibilitas B2B dan ekspansi pasar.', tag: 'Web Development' },
      { id: '2', num: '02', title: 'Landing Page', desc: 'Halaman kampanye pemasaran fokus konversi tinggi untuk iklan Google/Meta Ads dan peluncuran produk.', tag: 'Web Development' },
      { id: '3', num: '03', title: 'E-Commerce', badge: 'UNGGULAN', desc: 'Toko online lengkap dengan payment gateway lokal (Midtrans/Xendit), manajemen stok, dan hitung ongkir otomatis.', tag: 'Web Development' },
      { id: '4', num: '04', title: 'Web Application', desc: 'Sistem aplikasi web custom sesuai alur kerja operasional perusahaan Anda (ERP, CRM, POS, Portal Internal).', tag: 'Web Development' }
    ]
  },
  {
    id: 'mobile-development',
    slug: 'mobile-development',
    name: 'Mobile Development',
    subtitle: 'Aplikasi Android, iOS, dan cross-platform.',
    description: 'Solusi aplikasi mobile native & cross-platform Flutter/React Native modern dan responsif.',
    itemsCount: '3 solusi dalam kategori ini',
    iconId: 'mobile',
    items: [
      { id: '1', num: '01', title: 'Android & iOS App', badge: 'UNGGULAN', desc: 'Aplikasi mobile berperforma tinggi dengan React Native/Flutter untuk pengguna iOS & Android sekaligus.', tag: 'Mobile App' },
      { id: '2', num: '02', title: 'Aplikasi Kasir / POS Mobile', badge: 'POPULER', desc: 'Aplikasi kasir dan manajemen transaksi UMKM terintegrasi printer bluetooth dan laporan keuangan real-time.', tag: 'Mobile App' },
      { id: '3', num: '03', title: 'Aplikasi Layanan & Booking', desc: 'Sistem aplikasi pemesanan jasa, reservasi, dan pelacakan kurir/driver lokasi real-time.', tag: 'Mobile App' }
    ]
  },
  {
    id: 'iot-solutions',
    slug: 'iot-solutions',
    name: 'IoT Solutions',
    subtitle: 'Dashboard, ESP32, dan monitoring pintar.',
    description: 'Integrasi perangkat keras mikrokontroler (ESP32/Arduino) ke sistem cloud & dashboard monitoring real-time.',
    itemsCount: '2 solusi dalam kategori ini',
    iconId: 'chip',
    items: [
      { id: '1', num: '01', title: 'Smart Monitoring System', badge: 'UNGGULAN', desc: 'Dashboard pemantauan suhu, kelembaban, energi, dan sensor industri secara terpusat & alert Telegram.', tag: 'IoT' },
      { id: '2', num: '02', title: 'Automation & Control System', desc: 'Sistem otomasi sakelar, valve, dan kendali jarak jauh perangkat keras berbasis web & mobile apps.', tag: 'IoT' }
    ]
  },
  {
    id: 'cloud-infrastructure',
    slug: 'cloud-infrastructure',
    name: 'Cloud & Infrastructure',
    subtitle: 'REST API, VPS, server, dan cloud deployment.',
    description: 'Konfigurasi server linux, backend API microservices, dan optimalisasi keamanan cloud server.',
    itemsCount: '2 solusi dalam kategori ini',
    iconId: 'cloud',
    items: [
      { id: '1', num: '01', title: 'RESTful API & Microservices', badge: 'UNGGULAN', desc: 'Arsitektur backend scalable dengan Laravel / Node.js untuk integrasi antar platform pihak ketiga.', tag: 'Cloud' },
      { id: '2', num: '02', title: 'Server VPS & Cloud Setup', desc: 'Installasi Nginx, Docker, SSL, database cluster, serta hardening server VPS Linux.', tag: 'Cloud' }
    ]
  },
  {
    id: 'future-innovation',
    slug: 'future-innovation',
    name: 'Future & Innovation',
    subtitle: 'AI, SaaS, keamanan, dan enterprise.',
    description: 'Implementasi integrasi AI OpenAI/Gemini, SaaS multi-tenant, dan konsultasi arsitektur perangkat lunak.',
    itemsCount: '2 solusi dalam kategori ini',
    iconId: 'sparkles',
    items: [
      { id: '1', num: '01', title: 'Integrasi AI & Machine Learning', badge: 'SEGERA', desc: 'Fitur kecerdasan buatan seperti chatbot otomatis, analisis dokumen AI, dan pengenalan gambar.', tag: 'Innovation' },
      { id: '2', num: '02', title: 'SaaS Multi-Tenant System', desc: 'Pengembangan produk Software-as-a-Service dengan manajemen langganan dan isolasi data user.', tag: 'Innovation' }
    ]
  }
]
