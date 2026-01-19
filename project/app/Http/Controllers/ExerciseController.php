<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExerciseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'teacher') {
            $exercises = Exercise::where('teacher_id', $user->id)->with('lesson')->get();
        } else {
            $exercises = Exercise::with(['lesson', 'teacher'])->get();
        }
        
        return response()->json($exercises);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'lesson_id' => 'required|exists:lessons,id'
        ]);

        $lesson = Lesson::findOrFail($request->lesson_id);
        
        if ($lesson->teacher_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $exercise = Exercise::create([
            'title' => $request->title,
            'description' => $request->description,
            'lesson_id' => $request->lesson_id,
            'teacher_id' => Auth::id()
        ]);

        return response()->json($exercise, 201);
    }

    public function show($id)
    {
        $exercise = Exercise::with(['lesson', 'teacher'])->findOrFail($id);
        return response()->json($exercise);
    }

    public function update(Request $request, $id)
    {
        $exercise = Exercise::findOrFail($id);
        
        if ($exercise->teacher_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'solution' => 'sometimes|string'
        ]);

        $exercise->update($request->all());

        return response()->json($exercise);
    }

    public function destroy($id)
    {
        $exercise = Exercise::findOrFail($id);
        
        if ($exercise->teacher_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted successfully']);
    }

    public function getByLesson($lessonId)
    {
        $exercises = Exercise::where('lesson_id', $lessonId)->with('teacher')->get();
        return response()->json($exercises);
    }
}