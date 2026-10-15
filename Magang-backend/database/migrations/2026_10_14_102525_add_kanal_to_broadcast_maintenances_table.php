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
        Schema::table('broadcast_maintenances', function (Blueprint $table) {
            $table->enum('kanal', ['web', 'wa', 'keduanya'])->default('keduanya')->after('target');
            $table->boolean('is_published_web')->default(true)->after('is_active');
            $table->string('status')->default('draft')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('broadcast_maintenances', function (Blueprint $table) {
            $table->dropColumn(['kanal', 'is_published_web']);
        });
    }
};
