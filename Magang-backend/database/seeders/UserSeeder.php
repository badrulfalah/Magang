<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@kurva.test'],
            [
                'name' => 'Admin Kurva',
                'password' => 'password',
                'status' => 'aktif',
            ]
        );
        $admin->assignRole('admin');

        $marketing = User::updateOrCreate(
            ['email' => 'marketing@kurva.test'],
            [
                'name' => 'Marketing Kurva',
                'password' => 'password',
                'status' => 'aktif',
            ]
        );
        $marketing->assignRole('marketing');

        $customer = User::updateOrCreate(
            ['email' => 'customer@kurva.test'],
            [
                'name' => 'Customer Kurva',
                'password' => 'password',
                'status' => 'aktif',
            ]
        );
        $customer->assignRole('customer');
    }
}
