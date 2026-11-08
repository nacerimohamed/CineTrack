<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserMovieController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->movies();

        if ($request->filled('status')) {
            $request->validate([
                'status' => ['string', Rule::in(['watchlist', 'watched'])],
            ]);

            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', Rule::in(['watchlist', 'watched'])],
        ]);

        $movie = $request->user()->movies()->updateOrCreate(
            ['movie_id' => $validated['movie_id']],
            [
                'status' => $validated['status'],
                'watched_at' => $validated['status'] === 'watched' ? now() : null,
            ]
        );

        return response()->json([
            'message' => 'Movie saved successfully.',
            'movie' => $movie,
        ], 200);
    }

    public function update(Request $request, int $movieId)
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'string', Rule::in(['watchlist', 'watched'])],
            'rating' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:10'],
            'review' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ]);

        $movie = $request->user()->movies()
            ->where('movie_id', $movieId)
            ->firstOrFail();

        $movie->fill($validated);

        if (isset($validated['status'])) {
            $movie->watched_at = $validated['status'] === 'watched'
                ? ($movie->watched_at ?? now())
                : null;
        }

        $movie->save();

        return response()->json([
            'message' => 'Movie updated successfully.',
            'movie' => $movie,
        ]);
    }

    public function destroy(Request $request, int $movieId)
    {
        $movie = $request->user()->movies()
            ->where('movie_id', $movieId)
            ->firstOrFail();

        $movie->delete();

        return response()->json([
            'message' => 'Movie removed successfully.',
        ]);
    }
}
