import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  readonly DATABASE_FIREBASE_URL: string =
    'https://rent-house-app-25360-default-rtdb.europe-west1.firebasedatabase.app/offered-places';

  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}
  /* ----- GET ALL PLACES ----- */
  fetchPlaces() {
    return this.http
      .get<{
        [key: string]: PlaceData;
      }>(`${this.DATABASE_FIREBASE_URL}.json`)
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imgUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          // return [];
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(`${this.DATABASE_FIREBASE_URL}/${id}.json`)
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imgUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://img.freepik.com/free-vector/private-residence-abstract-concept-vector-illustration-single-family-residence-home-private-entity-town-house-housing-type-surrounding-land-ownership-real-estate-market-abstract-metaphor_335657-1972.jpg?w=2000',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{ name: string }>(`${this.DATABASE_FIREBASE_URL}.json`, {
        ...newPlace,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // this._places.push(newPlace);
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatePlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex((p) => p.id === placeId);
        updatePlaces = [...places];
        const oldPlace = updatePlaces[updatePlaceIndex];
        updatePlaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imgUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(`${this.DATABASE_FIREBASE_URL}/${placeId}.json`, {
          ...updatePlaces[updatePlaceIndex],
          id: null,
        });
      }),
      tap(() => {
        this._places.next(updatePlaces);
      })
    );
  }
}

// new Place(
//   '1',
//   'Big House',
//   'Big House is a big house in the family Big House.',
//   'https://img.freepik.com/free-vector/private-residence-abstract-concept-vector-illustration-single-family-residence-home-private-entity-town-house-housing-type-surrounding-land-ownership-real-estate-market-abstract-metaphor_335657-1972.jpg?w=2000',
//   100,
//   new Date('2022-12-01'),
//   new Date('2023-12-31'),
//   'abc'
// ),
// new Place(
//   '2',
//   'Medium House',
//   'Medium House is a medium house in the family Medium House.',
//   'https://img.freepik.com/free-vector/detached-house-abstract-concept-vector-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit-abstract-metaphor_335657-1974.jpg?w=2000',
//   75,
//   new Date('2022-12-01'),
//   new Date('2023-12-31'),
//   'abc'
// ),
// new Place(
//   '3',
//   'Small House',
//   'Small House is a small house in the family Small House.',
//   'https://img.freepik.com/free-vector/detached-house-abstract-concept-vector-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit-abstract-metaphor_335657-4253.jpg?w=2000',
//   50,
//   new Date('2022-12-01'),
//   new Date('2023-12-31'),
//   'abc'
// ),
// new Place(
//   '4',
//   'Mansion House',
//   'Mansion House is a mansion house in the family Mansion House.',
//   'https://img.freepik.com/free-vector/private-residence-abstract-concept-vector-illustration-single-family-residence-home-private-entity-town-house-housing-type-surrounding-land-ownership-real-estate-market-abstract-metaphor_335657-4251.jpg?w=2000',
//   150,
//   new Date('2022-12-01'),
//   new Date('2023-12-31'),
//   'abc'
// ),
// new Place(
//   '5',
//   'House Camp',
//   'House Camp is a place where you can place your customers and services  in different  locations',
//   'https://img.freepik.com/free-vector/detached-house-abstract-concept-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit_335657-1142.jpg?w=1060&t=st=1671297787~exp=1671298387~hmac=0386c2c19527ed1c6f4979712ad54c6030acffda2858cf3e3c51e0b10c6ec616',
//   25,
//   new Date('2022-12-01'),
//   new Date('2023-12-31'),
//   'abc'
// ),
