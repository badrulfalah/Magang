<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_logos', function (Blueprint $table) {
            $table->foreignId('dibuat_oleh')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });

        Schema::table('keunggulans', function (Blueprint $table) {
            $table->foreignId('dibuat_oleh')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('client_logos', function (Blueprint $table) {
            $table->dropForeign(['dibuat_oleh']);
            $table->dropColumn('dibuat_oleh');
        });

        Schema::table('keunggulans', function (Blueprint $table) {
            $table->dropForeign(['dibuat_oleh']);
            $table->dropColumn('dibuat_oleh');
        });
    }
};
