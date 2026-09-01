<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        $user->load('roles');

        return response()->json([
            'user' => $user,
            'token' => $token,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'status' => 'aktif',
        ]);

        $user->assignRole('customer');
        $user->load('roles');

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ], 201);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->update(['last_seen' => null]);
        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $user->load('roles');

        return response()->json([
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}
