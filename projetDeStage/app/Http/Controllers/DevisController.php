<?php

namespace App\Http\Controllers;

use App\Models\devisOffres;

use Illuminate\Http\Request;

class DevisController extends Controller
{
    
      // Afficher toutes les prospectives
      public function index()
      {
          try {
              return devisOffres::all();
          } catch (\Exception $e) {
              \Log::error($e->getMessage());
              return response()->json(['error' => 'Une erreur est survenue lors de la récupération des prospections'], 500);
          }
      }

      // Créer une nouvelle prospection
    public function store(Request $request)
    {
        $devis = devisOffres::create($request->all());
        return response()->json($devis, 201);
    }

    // Mettre à jour une prospection existante
    public function update(Request $request, $id)
    {
        $devis = devisOffres::findOrFail($id);
        $devis->update($request->all());
        return response()->json($devis, 200);
    }

    // Supprimer une prospection
    public function destroy($id)
    {
        devisOffres::destroy($id);
        return response()->json(null, 204);
    }
}
