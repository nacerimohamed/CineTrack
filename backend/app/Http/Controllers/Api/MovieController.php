<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MovieController extends Controller
{
    private function tmdbRequest(string $endpoint, array $params = [])
    {
        $apiKey = config('services.tmdb.api_key');

        if (!$apiKey) {
            return response()->json([
                'message' => 'TMDB API key is not configured.',
            ], 500);
        }

        $response = Http::timeout(20)->get(
            config('services.tmdb.base_url') . $endpoint,
            array_merge([
                'api_key' => $apiKey,
                'language' => 'en-US',
            ], $params)
        );

        if ($response->failed()) {
            return response()->json([
                'message' => 'Unable to retrieve movies from TMDB.',
            ], $response->status());
        }

        return response()->json($response->json());
    }

    public function trending()
    {
        return $this->tmdbRequest('/trending/movie/week');
    }

    public function topRated()
    {
        return $this->tmdbRequest('/movie/top_rated');
    }

    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1', 'max:500'],
        ]);

        return $this->tmdbRequest('/search/movie', [
            'query' => $validated['query'],
            'page' => $validated['page'] ?? 1,
            'include_adult' => false,
        ]);
    }

    public function details(string $id)
    {
        return $this->tmdbRequest('/movie/' . $id);
    }
}