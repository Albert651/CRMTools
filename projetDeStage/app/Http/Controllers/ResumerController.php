<?php

namespace App\Http\Controllers;

use App\Models\Resumer;

use Illuminate\Http\Request;

class ResumerController extends Controller
{
    // Afficher toutes les prospectives
    public function index()
    {
        try {
            return Resumer::all();
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de la récupération des prospections'], 500);
        }
    }

     // Créer une nouvelle Resumer
     public function store(Request $request)
     {
         $resumer = Resumer::create($request->all());
         return response()->json($resumer, 201);
     }

       // Mettre à jour une prospection existante
    public function update(Request $request, $id)
    {
        $resumer = Resumer::findOrFail($id);
        $resumer->update($request->all());
        return response()->json($resumer, 200);
    }

    // Supprimer une prospection
    public function destroy($id)
    {
        Resumer::destroy($id);
        return response()->json(null, 204);
    }
 

}
