<?php

namespace App\Http\Controllers;

use App\Flight;
use App\Http\Resources\FlightResource;
use Carbon\Carbon;
use Carbon\Traits\Date;
use Illuminate\Http\Request;


class FlightController extends Controller
{
    public function show(Request $request)
    {
        $flightsToday = Flight::whereDate('departure_date', Carbon::today())->get();
        $flightsTomorrow = Flight::whereDate('departure_date', Carbon::tomorrow())->get();
        $count = count($flightsToday) + count($flightsTomorrow);
        $flightsToday = FlightResource::collection($flightsToday);
        $flightsTomorrow = FlightResource::collection($flightsTomorrow);
        return response(['body' => [
            'count' => $count,
            'flights' => [
                date('Y-m-d') => $flightsToday,
                date('Y-m-d', mktime( date('d')+1)) => $flightsTomorrow,
            ],
        ]], 200);
    }

    public function add(Request $request)
    {
        $flight = Flight::create([
            'flight' => $request->flight,
            'route' => $request->route,
            'departure_time' => $request->departure_time,
            'departure_date' => $request->departure_date,
            'status' => 'on-time'
        ]);
        $id = $flight->id;
        return response(['body' => [
            'flight_id' => $id
        ]], 201);
    }

    public function edit(Request $request)
    {
        $flight = Flight::find($request->id);
        if ($flight) {
            if ($request->delay) $flight->delay = $request->delay;
            if ($request->gate) $flight->gate = $request->gate;
            if ($request->status) $flight->status = $request->status;
            $flight->save();
            return response('', 202);
        }
        return response('', 404);
    }

}
