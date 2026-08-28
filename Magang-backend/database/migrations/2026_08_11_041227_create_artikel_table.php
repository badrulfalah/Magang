<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artikel', function (Blueprint $table) {
            $table->bigIncrements('id_artikel');
            $table->unsignedBigInteger('id_kategori_artikel');
            $table->unsignedBigInteger('id_penulis');
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('konten');
            $table->string('foto_sampul')->nullable();
            $table->string('status')->default('draft');
            $table->dateTime('dipublikasikan_pada')->nullable();

            $table->foreign('id_kategori_artikel')->references('id_kategori_artikel')->on('kategori_artikel')->onDelete('cascade');
            $table->foreign('id_penulis')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artikel');
    }
};
