import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated = false;

  public get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor() {}

  login() {
    console.log('is Login');
    this._userIsAuthenticated = true;
  }
  logout() {
    console.log('is Logout');
    this._userIsAuthenticated = false;
  }
}
