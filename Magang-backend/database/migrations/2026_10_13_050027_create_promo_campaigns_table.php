<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_campaigns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dibuat_oleh');
            $table->string('judul');
            $table->text('pesan');
            $table->string('dokumen_path')->nullable();
            $table->json('segment_target')->nullable();
            $table->json('customer_ids')->nullable();
            $table->integer('total_penerima')->default(0);
            $table->enum('status', ['draft', 'terkirim'])->default('draft');
            $table->timestamps();

            $table->foreign('dibuat_oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_campaigns');
    }
};
