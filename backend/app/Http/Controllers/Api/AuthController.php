<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Google\Client as GoogleClient;

class AuthController extends Controller
{
    // Register with email
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        return response()->json([
            'message' => 'Account created. Please verify your email.',
            'user' => $user,
        ], 201);
    }

    // Login with email
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();

        if (!$user->hasVerifiedEmail()) {
            Auth::logout();

            return response()->json([
                'message' => 'Please verify your email before logging in.',
            ], 403);
        }

        $token = $user->createToken('cinetrack-mobile')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Login or register with Google
    public function googleLogin(Request $request)
    {
        $validated = $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        try {
            $client = new GoogleClient();

            $client->setClientId(config('services.google.client_id'));

            $payload = $client->verifyIdToken($validated['id_token']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Google authentication failed.',
            ], 401);
        }

        if (
            !$payload ||
            empty($payload['email']) ||
            empty($payload['sub']) ||
            empty($payload['email_verified']) ||
            $payload['email_verified'] !== true
        ) {
            return response()->json([
                'message' => 'Invalid or unverified Google account.',
            ], 401);
        }

        $email = strtolower($payload['email']);

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (!$user) {
            $user = User::create([
                'name' => $payload['name'] ?? 'CineTrack User',
                'email' => $email,
                'password' => Str::random(64),
            ]);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->email_verified_at = now();
            $user->save();
        }

        $token = $user->createToken('cinetrack-mobile')->plainTextToken;

        return response()->json([
            'message' => 'Google login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    // Current user
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
