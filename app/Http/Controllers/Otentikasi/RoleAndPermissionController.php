<?php

namespace App\Http\Controllers\Otentikasi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionController extends Controller
{
    public function indexRole()
    {
        $roles = Role::all();

        $mapRoles = $roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return Inertia::render('otentikasi/role', ['roles' => $mapRoles]);
    }

    public function updatePermission(Request $request, Role $role)
    {
        try {
            DB::beginTransaction();
            $validated = $request->validate([
                'permissions' => 'required|array',
            ]);
            $permission = $validated['permissions'];

            foreach ($permission as $permissionName => $value) {
                $permission = Permission::where('name', $permissionName)->first();

                if (! $permission) {
                    continue; // skip jika permission tidak ditemukan
                }
                if ($value === true) {
                    $role->givePermissionTo($permission);
                } else {
                    $role->revokePermissionTo($permission);
                }
            }

            DB::commit();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Permission Berhasil Diperbarui',
            ]);

            return redirect()->route('otentikasi.role');

        } catch (\Exception $e) {
            DB::rollBack();
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput();
        }
    }

    public function indexPermission(Request $request, Role $role)
    {
        try {

            // permission milik role (collection of string)
            $rolePermissions = $role->permissions->pluck('name')->toArray();

            // definisi modul + label
            $modules = [
                'dashboard' => 'Dashboard',
                'inventory' => 'Inventory',
                'sales' => 'Sales Service',
                'news' => 'News',
                'master' => 'Master',
                'otentikasi' => 'Otentikasi',
            ];

            // action yang kita tampilkan
            $actions = ['view', 'create', 'edit', 'delete'];

            $data = [];

            foreach ($modules as $moduleKey => $moduleName) {
                $row = [
                    'modul' => $moduleKey,
                    'nama_modul' => $moduleName,
                ];

                foreach ($actions as $action) {
                    $permissionName = "{$moduleKey}.{$action}";

                    // cek apakah permission ini ada di sistem sama sekali
                    $permissionExists = Permission::where(
                        'name',
                        $permissionName
                    )->exists();

                    if (! $permissionExists) {
                        $row[$action] = null; // modul tidak support action ini
                    } else {
                        $row[$action] = in_array($permissionName, $rolePermissions);
                    }
                }

                $data[] = $row;
            }

            return Inertia::render('otentikasi/permission', ['role' => $role, 'permissions' => $data]);
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput()->withErrors($e->getMessage());
        }
    }

    public function storeRole(Request $request)
    {
        try {
            $validated = $request->validate([
                'role_name' => 'required|string|unique:roles,name',
            ]);
            // normalisasi ke snake_case
            $roleName = Str::snake($validated['role_name']);

            $role = Role::create([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);

            app(PermissionRegistrar::class)->forgetCachedPermissions();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Role Berhasil Disimpan',
            ]);

            return redirect()->route('otentikasi.role');

        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput()->withErrors($e->getMessage());
        }
    }

    public function destroyRole($role)
    {
        try {
            DB::beginTransaction();

            $role = Role::where('name', $role)->firstOrFail();

            $role->permissions()->detach();
            $role->delete();

            app(PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Role Berhasil Dihapus',
            ]);

            return redirect()->route('otentikasi.role');

        } catch (\Exception $e) {
            DB::rollBack();
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput()->withErrors($e->getMessage());
        }
    }
}
