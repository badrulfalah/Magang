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
        Schema::create('testimoni', function (Blueprint $table) {
            $table->bigIncrements('id_testimoni');
            $table->unsignedBigInteger('id_user')->nullable();
            $table->string('nama_klien');
            $table->string('jabatan')->nullable();
            $table->text('isi_testimoni');
            $table->integer('rating');
            $table->string('foto')->nullable();
            $table->string('status')->default('pending');
            $table->dateTime('dibuat_pada');

            $table->foreign('id_user')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimoni');
    }
};
