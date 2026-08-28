<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            UserSeeder::class,
            KontenSeeder::class,
            LayananSeeder::class,
            ProdukSeeder::class,
            DummyTestimoniSeeder::class,
            KeunggulanSeeder::class,
        ]);
    }
}
