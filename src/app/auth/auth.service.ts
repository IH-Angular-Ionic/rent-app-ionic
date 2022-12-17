import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'qwe';
  // private _userId = 'abc';

  public get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
  public get userId() {
    return this._userId;
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
