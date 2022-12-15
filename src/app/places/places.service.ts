import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      '1',
      'Big House',
      'Big House is a big house in the family Big House.',
      'https://img.freepik.com/free-vector/private-residence-abstract-concept-vector-illustration-single-family-residence-home-private-entity-town-house-housing-type-surrounding-land-ownership-real-estate-market-abstract-metaphor_335657-1972.jpg?w=2000',
      100
    ),
    new Place(
      '2',
      'Medium House',
      'Medium House is a medium house in the family Medium House.',
      'https://img.freepik.com/free-vector/detached-house-abstract-concept-vector-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit-abstract-metaphor_335657-1974.jpg?w=2000',
      75
    ),
    new Place(
      '3',
      'Small House',
      'Small House is a small house in the family Small House.',
      'https://img.freepik.com/free-vector/detached-house-abstract-concept-vector-illustration-single-family-house-stand-alone-household-single-detached-building-individual-land-ownership-unattached-dwelling-unit-abstract-metaphor_335657-4253.jpg?w=2000',
      50
    ),
  ];

  get places() {
    return [...this._places];
  }
  constructor() {}
  getPlace(id: string) {
    return { ...this._places.find((p) => p.id === id) };
  }
}
