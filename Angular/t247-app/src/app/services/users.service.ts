import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {User} from '../user';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs/Rx";
import "rxjs/Rx";
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

@Injectable()
export class UsersService {

  private loggedIn = false; // Flag that indicating if the user is


  private LOGIN_URL =  environment.apiURL + '/users/login';
  private LOGOUT_URL = environment.apiURL + '/users/logout';
  private EDIT_URL = environment.apiURL + '/users/';
  private ROLES_URL = environment.apiURL + '/users/role';
  private GET_URL = this.EDIT_URL;
  private CREATE_URL = this.GET_URL+"/create";
  private DELETE_URL = this.GET_URL;

  private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200'});

  constructor(private _router: Router, private http: Http, private _cacheService: CacheService) {
    this.loggedIn = !!sessionStorage.getItem('auth_token');
  }

  logout() {
    sessionStorage.removeItem("email_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("userJson");
    localStorage.removeItem("email_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userJson");
    this.loggedIn = false;
    this._router.navigate(['/login']);
  }

  /**
   * This functions sends a request to the API with email and password in order to get a valid user
   * if the credentials match.
   * This function also stores important information in local storage, please check the 'userJson' variable
   * @param user, an object of the class User with email and password
   * @returns {Observable<R>}
   */
  login(user) {
    return this.http
      .post(
        this.LOGIN_URL,
        {"email": user.email, "password": user.password},
        this.headers
      )
      .map(res => res.json())
      .map((res) => {
        if (res.token) {
          console.log(res.token); //TODO: KILL THIS LINE

          // Store the user info in local storage
          sessionStorage.setItem('userJson', JSON.stringify(new User(user.email, res.id, res.name, res.lastName, res.enrollment, res.role)));
          sessionStorage.setItem('auth_token', res.token);

          let availableRoles = ['student', 'professor', 'admin'];

          // Get the corresponding roles for this user
          while(res.role != availableRoles[availableRoles.length - 1]){
            availableRoles.pop(); // Demote this rank - role
          }

          sessionStorage.setItem('roles', JSON.stringify(availableRoles));

          this.loggedIn = true; // Flag true since user is now logged in

          // Checking if the user must fill missing information
          if (res.name === null || res.name == "") {
            this._router.navigate(['firstLogIn']);
          }
          else {
            this._router.navigate(['']);
          }
        }
        return res.token;
      }).catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  /**
   * This function checks if the user is already logged in with the loggedIn flag, in case the user is
   * not logged in the this function will redirect the user to the login screen.
   */
  checkCredentials() {
    if (!this.loggedIn) {
      this._router.navigate(['login']);
    }
  }

  editUser(user) {
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
      .put(
        this.EDIT_URL + user.id,
        {"first_name": user.first_name, "last_name": user.last_name, "enrollment": user.enrollment},
        this.headers
      )
      .map(res => {
        return res;
      });
  }

  addUserInfoFirstTimeLogIn(user) {
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
      .put(
        this.EDIT_URL + user.id,
        {"first_name": user.first_name, "last_name": user.last_name, "password_hash": user.password, "email": user.email},
        this.headers
      )
      .map(res => {
        return res;
      });
  }

  getUsers(){
    return this.http.get(this.GET_URL).map((response: Response) => response.json());
  }

  getUser(id){
    return this.http
    .get(
      this.GET_URL+id
    )
    .map((response: Response) => response.json());
  }

  createUser(user){
    console.log(this.CREATE_URL);
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
    .post(
      this.CREATE_URL,
      {"email":user.email,"enrollment":user.enrollment,"first_name":user.first_name,"last_name":user.last_name,"password":user.password,"role":user.role},
      this.headers
    )
    .map(res => {
      return res;
    });
  }

  deleteUser(user){
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
    .delete(
      this.DELETE_URL+user.id,
      this.headers
    )
    .map(res => {
      return res;
    });
  }

}
