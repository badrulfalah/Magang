<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->string('avatar')->nullable()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->string('status')->default('aktif')->after('phone');
            $table->string('google_id')->nullable()->unique()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->dropColumn(['avatar', 'phone', 'status', 'google_id']);
        });
    }
};
