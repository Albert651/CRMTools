<?php

namespace App\Http\Controllers;

use App\Models\Offres;

use Illuminate\Http\Request;

class OffresController extends Controller
{
     // Afficher toutes les prospectives
     public function index()
     {
         try {
             return Offres::all();
         } catch (\Exception $e) {
             \Log::error($e->getMessage());
             return response()->json(['error' => 'Une erreur est survenue lors de la récupération des prospections'], 500);
         }
     }

     // Créer une nouvelle prospection
   public function store(Request $request)
   {
       $offre = Offres::create($request->all());
       return response()->json($offre, 201);
   }

   // Mettre à jour une prospection existante
   public function update(Request $request, $id)
   {
       $offre = Offres::findOrFail($id);
       $offre->update($request->all());
       return response()->json($offre, 200);
   }

   // Supprimer une prospection
   public function destroy($id)
   {
       Offres::destroy($id);
       return response()->json(null, 204);
   }
}