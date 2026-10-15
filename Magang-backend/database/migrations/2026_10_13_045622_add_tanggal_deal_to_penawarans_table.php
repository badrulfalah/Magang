<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('penawarans', function (Blueprint $table) {
            $table->timestamp('tanggal_deal')->nullable()->after('status');
        });

        DB::table('penawarans')->where('status', 'diterima')->whereNull('tanggal_deal')->update([
            'tanggal_deal' => DB::raw('updated_at'),
        ]);
    }

    public function down(): void
    {
        Schema::table('penawarans', function (Blueprint $table) {
            $table->dropColumn('tanggal_deal');
        });
    }
};
