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
        Schema::create('layanan', function (Blueprint $table) {
            $table->bigIncrements('id_layanan');
            $table->unsignedBigInteger('id_kategori_layanan');
            $table->string('num');
            $table->string('title');
            $table->string('badge')->nullable();
            $table->text('desc');
            $table->string('tag');
            $table->timestamps();

            $table->foreign('id_kategori_layanan')->references('id_kategori_layanan')->on('kategori_layanan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layanan');
    }
};
