import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      '1',
      'Big House',
      'Big House is a big house in the family Big House.',
      'https://img.freepik.com/free-vector/private-residence-abstract-concept-vector-illustration-single-family-residence-home-private-entity-town-house-housing-type-surrounding-land-ownership-real-estate-market-abstract-metaphor_335657-1972.jpg?w=2000',
      100,
      new Date('2022-12-01'),
      new Date('2023-12-31'),
      'abc'
    ),
    new Place(
      '2',
      'Medium House',
      'Medium House is a medium house in the family Medium House.',
      'https://img.freepik.com/free-vector/detached-house-abstract-concept-vector-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit-abstract-metaphor_335657-1974.jpg?w=2000',
      75,
      new Date('2022-12-01'),
      new Date('2023-12-31'),
      'abc'
    ),
    new Place(
      '3',
      'Small House',
      'Small House is a small house in the family Small House.',
      'https://img.freepik.com/free-vector/detached-house-abstract-concept-vector-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit-abstract-metaphor_335657-4253.jpg?w=2000',
      50,
      new Date('2022-12-01'),
      new Date('2023-12-31'),
      'abc'
    ),
    new Place(
      '4',
      'Mansion House',
      'Mansion House is a mansion house in the family Mansion House.',
      'https://img.freepik.com/free-vector/private-residence-abstract-concept-vector-illustration-single-family-residence-home-private-entity-town-house-housing-type-surrounding-land-ownership-real-estate-market-abstract-metaphor_335657-4251.jpg?w=2000',
      150,
      new Date('2022-12-01'),
      new Date('2023-12-31'),
      'abc'
    ),
    new Place(
      '5',
      'House Camp',
      'House Camp is a place where you can place your customers and services  in different  locations',
      'https://img.freepik.com/free-vector/detached-house-abstract-concept-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit_335657-1142.jpg?w=1060&t=st=1671297787~exp=1671298387~hmac=0386c2c19527ed1c6f4979712ad54c6030acffda2858cf3e3c51e0b10c6ec616',
      25,
      new Date('2022-12-01'),
      new Date('2023-12-31'),
      'abc'
    ),
  ]);

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
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
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://static.vecteezy.com/system/resources/previews/002/172/762/original/house-front-view-illustration-free-vector.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    // this._places.push(newPlace);
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1500),
      tap((places) => {
        const updatePlaceIndex = places.findIndex((p) => p.id === placeId);
        const updatePlaces = [...places];
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
        this._places.next(updatePlaces);
      })
    );
  }
}
