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
        Schema::create('pengaturan_situs', function (Blueprint $table) {
            $table->bigIncrements('id_pengaturan');
            $table->unsignedBigInteger('diubah_oleh')->nullable();
            $table->string('kunci')->unique();
            $table->text('nilai');

            $table->foreign('diubah_oleh')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_situs');
    }
};
