<?php

namespace App\services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserService
{
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            $avatarPath = null;

            if (! empty($data['avatar'])) {
                $file = $data['avatar'];
                $avatarPath = $this->uploadFile($file);
            }

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'avatar' => $avatarPath,
                'password' => Hash::make($data['password']),
            ]);

            // Assign roles
            if (! empty($data['data_roles'])) {
                $user->syncRoles(
                    collect($data['data_roles'])
                        ->map(fn ($id) => (int) $id)
                        ->toArray()
                );
            }
        });
    }

    public function update(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {

            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->phone = $data['phone'] ?? null;

            // Update password jika diisi
            if (! empty($data['password'])) {
                $user->password = Hash::make($data['password']);
            }

            // Upload avatar
            if (! empty($data['avatar'])) {

                // Hapus avatar lama jika ada
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }

                $user->avatar = $this->uploadFile($data['avatar']);
            }

            $user->save();
            $roleIds = collect($data['data_roles'] ?? [])
                ->map(fn ($id) => (int) $id)
                ->toArray();

            $user->syncRoles($roleIds);

            // Sync roles
            $user->syncRoles($roleIds);
        });
    }

    public function uploadFile($file): mixed
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();
        $avatarPath = $file->storeAs('users/avatars', $fileName, 'public');

        return $avatarPath;
    }
}
