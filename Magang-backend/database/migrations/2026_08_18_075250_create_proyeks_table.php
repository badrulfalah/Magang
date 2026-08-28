<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proyeks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('penawaran_id')->nullable();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('layanan_id')->nullable();
            $table->string('nama_proyek');
            $table->text('deskripsi_kebutuhan');
            $table->integer('progress')->default(0);
            $table->enum('status_proyek', ['pengajuan', 'planning', 'on progress', 'testing', 'selesai'])->default('pengajuan');
            $table->json('timeline')->nullable();
            $table->json('dokumentasi')->nullable();
            $table->timestamps();

            $table->foreign('penawaran_id')->references('id')->on('penawarans')->onDelete('set null');
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('layanan_id')->references('id_layanan')->on('layanan')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proyeks');
    }
};
