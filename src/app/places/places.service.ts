import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
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
    this.places.pipe(take(1)).subscribe((places) => {
      this._places.next(places.concat(newPlace));
    });
  }
}
