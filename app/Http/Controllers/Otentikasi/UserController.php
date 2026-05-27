<?php

namespace App\Http\Controllers\Otentikasi;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Mockery\Exception;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'phone', 'avatar'])
            ->with('roles:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'roles' => $user->roles->pluck('name')->toArray(),
                ];
            });

        return Inertia::render('otentikasi/user', ['users' => $users]);
    }

    public function formUser(Request $request)
    {
        $type = $request->string('type');
        $userId = $request->integer('user_id');

        $user = $userId
            ? User::with('roles:id,name')->findOrFail($userId)
            : null;

        $roles = Role::select('id', 'name')->get();

        if ($user) {
            $user->data_roles = $user->roles->pluck('id')->toArray();
        }

        return Inertia::render('otentikasi/form-user', [
            'roles' => $roles,
            'user' => $user,
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users', 'email'),
                ],
                'phone' => ['nullable', 'string', 'max:255'],
                'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5048'],
                'password' => ['required', 'string', 'min:8'],
                'password_confirmation' => ['required', 'same:password'],
                'data_roles' => ['nullable', 'array'],
                'data_roles.*' => ['exists:roles,id'],
            ]);
            $this->userService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data User berhasil disimpan',
            ]);

            return redirect()->route('otentikasi.user');

        } catch (Exception $e) {

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput();
        }
    }

    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users', 'email')->ignore($user->id),
                ],
                'phone' => ['nullable', 'string', 'max:255'],
                'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5048'],
                'password' => ['nullable', 'string', 'min:8'],
                'password_confirmation' => ['nullable', 'same:password'],
                'data_roles' => ['nullable', 'array'],
                'data_roles.*' => ['exists:roles,id'],
            ]);
            $this->userService->update($user, $validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data User berhasil diperbarui',
            ]);

            return redirect()->route('otentikasi.user');

        } catch (Exception $e) {

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput();
        }
    }

    public function destroy(Request $request) {}
}
