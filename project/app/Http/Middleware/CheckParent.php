<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckParent
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isParent()) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthorized. Parent access required.'
        ], 403);
    }
}