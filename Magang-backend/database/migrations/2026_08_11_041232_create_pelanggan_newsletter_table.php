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
        Schema::create('pelanggan_newsletter', function (Blueprint $table) {
            $table->bigIncrements('id_newsletter');
            $table->unsignedBigInteger('id_user')->nullable();
            $table->string('email')->unique();
            $table->string('status')->default('active');
            $table->dateTime('berlangganan_pada');

            $table->foreign('id_user')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggan_newsletter');
    }
};
