<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promo_campaigns', function (Blueprint $table) {
            $table->enum('status', ['draft', 'terkirim', 'gagal'])->default('draft')->change();
        });
    }

    public function down(): void
    {
        Schema::table('promo_campaigns', function (Blueprint $table) {
            $table->enum('status', ['draft', 'terkirim'])->default('draft')->change();
        });
    }
};
