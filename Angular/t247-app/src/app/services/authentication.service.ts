/**
 * Created by ahinojosa on 13/09/16.
 */

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

export class User {
  constructor(
    public email: string,
    public password: string,
    public roles : [string]) { }
}

var users = [
  new User('admin@admin.com','admin',['admin','prof','user']),
  new User('root@gmail.com','root',['user'])
];

@Injectable()
export class AuthenticationService {

  constructor(
    private _router: Router){}

  logout() {
    localStorage.removeItem("user");
    this._router.navigate(['login']);
  }

  login(user){
    var authenticatedUser = users[0]; // TODO: FIX THIS LINE
    if (authenticatedUser && authenticatedUser.password === user.password){
      //localStorage.setItem("user", authenticatedUser);
      localStorage.setItem("user",JSON.stringify(authenticatedUser));
      this._router.navigate(['']);
      return true;
    }
    return false;

  }

  checkCredentials(){
    if (localStorage.getItem("user") === null){
      this._router.navigate(['login']);
    }
  }
}
