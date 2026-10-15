<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('campaign_id');
            $table->unsignedBigInteger('customer_id');
            $table->string('nomor_wa')->nullable();
            $table->enum('status_kirim', ['pending', 'terkirim', 'gagal'])->default('pending');
            $table->text('response_fonnte')->nullable();
            $table->timestamps();

            $table->foreign('campaign_id')->references('id')->on('promo_campaigns')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_logs');
    }
};
