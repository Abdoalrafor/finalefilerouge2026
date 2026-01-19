<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'teacher') {
            $lessons = Lesson::where('teacher_id', $user->id)->get();
        } else {
            $lessons = Lesson::with('teacher')->get();
        }
        
        return response()->json($lessons);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $lesson = Lesson::create([
            'title' => $request->title,
            'content' => $request->content,
            'teacher_id' => Auth::id()
        ]);

        return response()->json($lesson, 201);
    }

    public function show($id)
    {
        $lesson = Lesson::with(['teacher', 'exercises'])->findOrFail($id);
        return response()->json($lesson);
    }

    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        
        if ($lesson->teacher_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string'
        ]);

        $lesson->update($request->all());

        return response()->json($lesson);
    }

    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        
        if ($lesson->teacher_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted successfully']);
    }
}