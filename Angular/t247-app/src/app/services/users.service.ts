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

  private loggedIn = false;

  private loginUrl =  environment.apiURL + '/users/login';
  private logoutUrl = environment.apiURL + '/users/logout';
  private baseURL = environment.apiURL + '/users/';
  private createURL = this.baseURL + "create";

  private rolesUrl = 'http://107.170.255.106:5000/api/users/role';

  private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200'});


  constructor(private _router: Router, private http: Http, private _cacheService: CacheService) {
    this.loggedIn = !!sessionStorage.getItem('auth_token');
  }

  logout() {
    this.request_logout().subscribe(
      data => {
        debugger;
        console.log('Successfully logged out');
        console.log(data);
      },
      err => {
        debugger;
        console.error(err);
      }

    );
    sessionStorage.removeItem("email_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("userJson");
    localStorage.removeItem("email_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userJson");
    this.loggedIn = false;
    this._router.navigate(['/login']);
  }

  request_logout() : Observable<any> {
    console.log('Logging out');
    let body = {"token": sessionStorage.getItem("auth_token")};
    let options = new RequestOptions({headers: this.headers});
    return this.http.post(this.logoutUrl, body, this.headers)
      .map(res => res.json())
      .map((res) => {
        console.log(res);
      })
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  complete_logout() {
    this.loggedIn = false;
    this._router.navigate(['/login']);
  }

  login(user) {
    return this.http
      .post(
        this.loginUrl,
        {"email": user.email, "password": user.password},
        this.headers
      )
      .map(res => res.json())
      .map((res) => {
        if (res.token) {
          sessionStorage.setItem('userJson', JSON.stringify(new User(user.email, res.id, res.name, res.lastName, res.enrollment)));
          sessionStorage.setItem('auth_token', res.token);
          sessionStorage.setItem('email_user', user.email);
          res["role"] = 'admin';
          let roles = ['student'];
          if (res.role == 'admin') {
            roles.push('admin', 'professor');
          }
          else if (res.role == 'professor') {
            roles.push('professor');
          }
          sessionStorage.setItem('roles', JSON.stringify(roles));
          this.loggedIn = true;
          this._router.navigate(['']);
        }
        return res.token;
      }).catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  checkCredentials() {
    if (!this.loggedIn) {
      this._router.navigate(['login']);
    }
  }

  editUser(user) {
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
      .put(
        this.baseURL + user.id,
        {"first_name": user.first_name, "last_name": user.last_name, "enrollment": user.enrollment},
        this.headers
      )
      .map(res => {
        return res;
      });
  }

  getUsers(){
    return this.http.get(this.baseURL).map((response: Response) => response.json());
  }

  getUser(id){
    return this.http
    .get(
      this.baseURL+id
    )
    .map((response: Response) => response.json());
  }

  createUser(user){
    console.log(this.createURL);
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
    .post(
      this.createURL,
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
      this.baseURL+user.id,
      this.headers
    )
    .map(res => {
      return res;
    });
  }

}
