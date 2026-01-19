<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStudent
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isStudent()) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthorized. Student access required.'
        ], 403);
    }
}