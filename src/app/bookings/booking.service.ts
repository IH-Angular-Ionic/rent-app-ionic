import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _booking: Booking[] = [
    {
      id: 'booking1',
      placeId: 'p1',
      placeTitle: 'Big House',
      guestNumber: 3,
      userId: 'abc',
    },
  ];

  public get booking() {
    return [...this._booking];
  }

  constructor() {}
}
