<?php

namespace App\Http\Controllers;

use App\Models\Document;

use Illuminate\Http\Request;

class DocumentController extends Controller
{
       // Afficher toutes les prospectives
       public function index()
       {
           try {
               return Document::all();
           } catch (\Exception $e) {
               \Log::error($e->getMessage());
               return response()->json(['error' => 'Une erreur est survenue lors de la récupération des prospections'], 500);
           }
       }
  
       // Créer une nouvelle prospection
       public function store(Request $request)
       {
           
           $validatedData = $request->validate([
               'file' => 'required|file|mimes:pdf,docx,jpg,jpeg,png,doc,txt,php,zip|max:2048',
               'type' => 'required|string|max:255',
               'client_proprietaire' => 'required|string|max:255',
               'date_document' => 'required|date',
           ]);
   
           try {
               if ($request->hasFile('file')) {
                   $filePath = $request->file('file')->store('documents', 'public');
               } else {
                   return response()->json(['error' => 'Aucun fichier n\'a été téléchargé'], 422);
               }
   
               $document = new Document();
               $document->file_path = $filePath;
               $document->type = $validatedData['type'];
               $document->client_proprietaire = $validatedData['client_proprietaire'];
               $document->date_document = $validatedData['date_document'];
               $document->save();
   
               return response()->json($document, 201);
           } catch (\Exception $e) {
               Log::error('Erreur lors de l\'ajout du document : ' . $e->getMessage());
               return response()->json(['error' => 'Une erreur est survenue lors de l\'ajout du document'], 500);
           }
       }
       
    public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'file' => 'required|file|mimes:pdf,docx,jpg,jpeg,png,doc,txt,php,zip|max:2048',
        'type' => 'required|string|max:255',
        'client_proprietaire' => 'required|string|max:255',
        'date_document' => 'required|date',
    ]);

    try {
        $document = Document::findOrFail($id);

        if ($request->hasFile('file')) {
            // Supprimer l'ancien fichier
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $filePath = $request->file('file')->store('documents', 'public');
            $document->file_path = $filePath;
        }

        $document->type = $validatedData['type'];
        $document->client_proprietaire = $validatedData['client_proprietaire'];
        $document->date_document = $validatedData['date_document'];
        $document->save();

        return response()->json($document, 200);
    } catch (\Exception $e) {
        \Log::error('Erreur lors de la mise à jour du document : ' . $e->getMessage());
        return response()->json(['error' => 'Une erreur est survenue lors de la mise à jour du document'], 500);
    }
}


     // Supprimer une prospection
     public function destroy($id)
     {
         Document::destroy($id);
         return response()->json(null, 204);
     }
}
