<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnggotaTim;
use App\Models\Artikel;
use App\Models\Faq;
use App\Models\Testimoni;
use App\Models\User;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\Penawaran;
use App\Models\Proyek;
use App\Models\PesanKontak;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $isMarketing = $user->roles->contains('name', 'marketing');
        $isCustomer = $user->roles->contains('name', 'customer');

        if ($isMarketing) {
            $totalChats = ChatSession::count();
            $myChatsCount = ChatSession::where('marketing_id', $user->id)->count();
            $activeLeadsCount = ChatSession::where('marketing_id', $user->id)->where('status', '!=', 'Selesai')->count();
            $pendingTestsCount = Testimoni::where('status', 'pending')->count();
            $totalPenawarans = Penawaran::count();
            $totalProyeks = Proyek::count();
            // Ambil semua chat session untuk track record
            $allLeads = ChatSession::with(['customer', 'product', 'marketing'])->orderBy('updated_at', 'desc')->get();
            // Ambil 5 pesan kontak terbaru untuk marketing (Primary key: id_pesan_kontak)
            $recentMessages = PesanKontak::with('user')->orderByDesc('id_pesan_kontak')->limit(5)->get();

            return response()->json([
                'marketing' => [
                    'totalChats' => $totalChats,
                    'myChats' => $myChatsCount,
                    'activeLeads' => $activeLeadsCount,
                    'pendingTestimonials' => $pendingTestsCount,
                    'totalPenawarans' => $totalPenawarans,
                    'totalProyeks' => $totalProyeks,
                    'recentMessages' => $recentMessages,
                    'allLeads' => $allLeads
                ]
            ]);
        }

        if ($isCustomer) {
            $activeProj = Proyek::where('customer_id', $user->id)->where('status_proyek', '!=', 'selesai')->count();
            $consultations = ChatSession::where('customer_id', $user->id)->whereIn('status', ['Ketertarikan', 'Ditindaklanjuti'])->count();
            $pendingPen = Penawaran::where('customer_id', $user->id)->where('status', 'pending')->count();
            // Ambil 5 pesan kontak terbaru dari customer ini (Primary key: id_pesan_kontak)
            $pesanKontaks = PesanKontak::where('id_user', $user->id)->orderByDesc('id_pesan_kontak')->limit(5)->get();

            return response()->json([
                'customer' => [
                    'activeProjects' => $activeProj,
                    'consultationsCount' => $consultations,
                    'supportTickets' => $pendingPen,
                    'accountStatus' => $user->status === 'aktif' ? 'Terverifikasi' : 'Aktif',
                    'recentMessages' => $pesanKontaks
                ]
            ]);
        }

        // Admin: ambil 5 pesan kontak terbaru dan jumlah pesan baru (Primary key: id_pesan_kontak)
        $recentMessages = PesanKontak::with('user')->orderByDesc('id_pesan_kontak')->limit(5)->get();
        $newMessagesCount = PesanKontak::where('status', 'new')->count();
        $allLeads = ChatSession::with(['customer', 'product', 'marketing'])->orderBy('updated_at', 'desc')->get();

        return response()->json([
            'users'          => User::count(),
            'roles'          => Role::count(),
            'permissions'    => Permission::count(),
            'articles'       => Artikel::count(),
            'testimonials'   => Testimoni::count(),
            'team'           => AnggotaTim::count(),
            'faqs'           => Faq::count(),
            'proyeks'        => Proyek::count(),
            'penawarans'     => Penawaran::count(),
            'chats'          => ChatSession::count(),
            'newMessages'    => $newMessagesCount,
            'recentMessages' => $recentMessages,
            'allLeads'       => $allLeads
        ]);
    }

    public function sidebarNotifications(Request $request)
    {
        $user = $request->user();
        $isCustomer = $user->roles->contains('name', 'customer');
        $isMarketing = $user->roles->contains('name', 'marketing');

        // 1. Chat & Konsultasi: hitung pesan unread
        $unreadChats = 0;
        if ($isCustomer) {
            $sessionIds = ChatSession::where('customer_id', $user->id)->pluck('id');
            $unreadChats = ChatMessage::whereIn('chat_session_id', $sessionIds)
                ->where('sender_id', '!=', $user->id)
                ->where('is_read', false)
                ->count();
        } else if ($isMarketing) {
            $sessionIds = ChatSession::where('marketing_id', $user->id)->pluck('id');
            $unreadChats = ChatMessage::whereIn('chat_session_id', $sessionIds)
                ->where('sender_id', '!=', $user->id)
                ->where('is_read', false)
                ->count();
        }

        // 2. Penawaran: hitung penawaran berstatus 'pending' (untuk customer yang butuh review, atau total pending untuk marketing)
        $pendingPenawaran = 0;
        if ($isCustomer) {
            $pendingPenawaran = Penawaran::where('customer_id', $user->id)
                ->where('status', 'pending')
                ->count();
        } else if ($isMarketing) {
            $pendingPenawaran = Penawaran::where('marketing_id', $user->id)
                ->where('status', 'pending')
                ->count();
        }

        // 3. Proyek: hitung proyek 'pengajuan' (untuk marketing) atau update progress/status proyek untuk customer
        // Supaya simpel dan tepat, kita hitung proyek berstatus 'pengajuan' jika marketing,
        // dan proyek berstatus bukan 'selesai' jika customer.
        $activeProyeks = 0;
        if ($isCustomer) {
            $activeProyeks = Proyek::where('customer_id', $user->id)
                ->where('status_proyek', '!=', 'selesai')
                ->count();
        } else if ($isMarketing) {
            $activeProyeks = Proyek::where('status_proyek', 'pengajuan')
                ->count();
        }

        return response()->json([
            'chat' => $unreadChats,
            'penawaran' => $pendingPenawaran,
            'proyek' => $activeProyeks,
            'has_penawaran' => Penawaran::where('customer_id', $user->id)->exists(),
            'has_selesai_lead' => ChatSession::where('customer_id', $user->id)->where('status', 'Selesai')->exists()
        ]);
    }
}
