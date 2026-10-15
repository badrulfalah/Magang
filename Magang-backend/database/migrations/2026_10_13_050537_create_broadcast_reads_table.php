<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('broadcast_reads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('broadcast_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('read_at')->useCurrent();
            $table->timestamps();

            $table->foreign('broadcast_id')->references('id')->on('broadcast_maintenances')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['broadcast_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('broadcast_reads');
    }
};
