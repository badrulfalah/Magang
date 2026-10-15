<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('broadcast_maintenances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dibuat_oleh');
            $table->string('judul');
            $table->text('pesan');
            $table->enum('jenis', ['maintenance', 'trouble', 'info'])->default('info');
            $table->enum('target', ['semua_customer', 'per_proyek'])->default('semua_customer');
            $table->unsignedBigInteger('proyek_id')->nullable();
            $table->timestamp('aktif_dari')->nullable();
            $table->timestamp('aktif_sampai')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('total_penerima')->default(0);
            $table->enum('status', ['draft', 'terkirim'])->default('draft');
            $table->timestamps();

            $table->foreign('dibuat_oleh')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('proyek_id')->references('id')->on('proyeks')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('broadcast_maintenances');
    }
};
