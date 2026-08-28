<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penawarans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('marketing_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('produk_id')->nullable();
            $table->unsignedBigInteger('layanan_id')->nullable();
            $table->string('judul');
            $table->text('deskripsi');
            $table->decimal('harga', 15, 2)->nullable();
            $table->string('brosur_path')->nullable();
            $table->enum('status', ['pending', 'diterima', 'ditolak'])->default('pending');
            $table->timestamps();

            $table->foreign('marketing_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('produk_id')->references('id_produk')->on('produks')->onDelete('set null');
            $table->foreign('layanan_id')->references('id_layanan')->on('layanan')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penawarans');
    }
};
