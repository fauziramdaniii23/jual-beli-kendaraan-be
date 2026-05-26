<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AssignPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'dashboard' => ['view'],

            'inventory' => [
                'view',
                'create',
                'edit',
                'delete',
            ],

            'sales' => [
                'view',
                'create',
                'edit',
                'delete',
            ],

            'customer' => [
                'view',
                'create',
                'edit',
                'delete',
            ],

            'news' => [
                'view',
                'create',
                'edit',
                'delete',
            ],

            'master' => [
                'view',
                'create',
                'edit',
                'delete',
            ],

            'otentikasi' => [
                'view',
                'create',
                'edit',
                'delete',
            ],
        ];

        $permissions = [];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $permission = Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'guard_name' => 'web',
                ]);

                $permissions[] = $permission;
            }
        }

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $adminRole->syncPermissions($permissions);
    }
}
