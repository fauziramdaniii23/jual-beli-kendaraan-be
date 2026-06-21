<?php

namespace App\Http\Controllers\Otentikasi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class NotificationController extends Controller
{
    public function index()
    {
        $roles = Role::all();

        $mapRoles = $roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'hasNotif' => $role->hasPermissionTo('notification'),
            ];
        });

        return Inertia::render('otentikasi/notification', ['roles' => $mapRoles]);
    }
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'role' => 'required|string',
                'hasNotif' => 'required|boolean',
            ]);
            $role = Role::where('name', $validated['role'])->firstOrFail();

            $permissionName = 'notification';

            if ($validated['hasNotif']) {
                $role->revokePermissionTo($permissionName);
            } else {
                $role->givePermissionTo($permissionName);
            }

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Notifikasi Berhasil Diperbarui',
            ]);

            return redirect()->route('otentikasi.notification');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
