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
        Schema::create('pesan_kontak', function (Blueprint $table) {
            $table->bigIncrements('id_pesan_kontak');
            $table->unsignedBigInteger('id_user')->nullable();
            $table->string('nama');
            $table->string('email');
            $table->string('no_hp')->nullable();
            $table->string('subjek');
            $table->text('pesan');
            $table->string('status')->default('new');
            $table->dateTime('dikirim_pada');

            $table->foreign('id_user')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesan_kontak');
    }
};
