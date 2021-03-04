<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected $table = 'flights';
    protected $fillable = ['flight', 'route', 'departure_time', 'delay', 'gate', 'status', 'departure_date'];
}
