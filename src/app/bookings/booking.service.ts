import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  // private _bookings: Booking[] = [];
  private _bookings = new BehaviorSubject<Booking[]>([]);

  readonly DATABASE_FIREBASE_URL: string =
    'https://rent-house-app-25360-default-rtdb.europe-west1.firebasedatabase.app/bookings';

  public get bookings() {
    // return [...this._bookings];
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.http
      .post<{ name: string }>(`${this.DATABASE_FIREBASE_URL}.json`, {
        ...newBooking,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
    // return this.bookings.pipe(
    //   take(1),
    //   delay(5000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.concat(newBooking));
    //   })
    // );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(2500),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }
}
