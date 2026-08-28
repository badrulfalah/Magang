<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Permission::withCount('roles');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('name')->get());
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'modul' => 'nullable|string|max:255',
            'panel' => 'nullable|string|max:255',
        ]);

        $permission = Permission::create($request->only('name', 'modul', 'panel'));

        return response()->json($permission, 201);
    }

    public function show(Permission $permission)
    {
        return response()->json($permission->load('roles'));
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => "required|string|max:255|unique:permissions,name,{$permission->id}",
            'modul' => 'nullable|string|max:255',
            'panel' => 'nullable|string|max:255',
        ]);

        $permission->update($request->only('name', 'modul', 'panel'));

        return response()->json($permission);
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return response()->json(['message' => 'Permission deleted']);
    }
}
