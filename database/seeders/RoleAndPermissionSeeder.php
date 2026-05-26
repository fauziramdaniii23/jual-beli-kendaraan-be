<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Inventory
            'inventory.view',
            'inventory.create',
            'inventory.edit',
            'inventory.delete',

            // Sales
            'sales.view',
            'sales.create',
            'sales.edit',
            'sales.delete',

            // Customer
            'customer.view',
            'customer.create',
            'customer.edit',
            'customer.delete',

            // News
            'news.view',
            'news.create',
            'news.edit',
            'news.delete',

            // Master
            'master.view',
            'master.create',
            'master.edit',
            'master.delete',

            // Otentikasi
            'otentikasi.view',
            'otentikasi.create',
            'otentikasi.edit',
            'otentikasi.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $roles = [
            'super admin',
            'sales',
            'owner',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web',
            ]);
        }

        // Assign semua permission ke admin
        $adminRole = Role::findByName('super.admin');

        $adminRole->syncPermissions($permissions);
    }
}
