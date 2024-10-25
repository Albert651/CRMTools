<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tache extends Model
{
    use HasFactory;

    // Fillable fields for mass assignment
    protected $fillable = [
        'etat',
        'intitule',
        'Intervenant',
        'date_prevus',
        'date_de_realisation',
        'commentaire',
        'lien_angenda',
        'numero_contact',
        'numero_employer',
    ];
}
