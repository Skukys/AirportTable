<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FlightResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'flight' => $this->flight,
            'route' => $this->route,
            'departure_time' => substr($this->departure_time, 0,5),
            'delay' => substr($this->delay, 0, 5),
            'gate' => $this->gate,
            'status' => $this->status,
        ];
    }
}
