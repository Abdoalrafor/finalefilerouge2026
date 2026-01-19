<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTeacher
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isTeacher()) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthorized. Teacher access required.'
        ], 403);
    }
}