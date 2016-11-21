import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    private options = new RequestOptions({headers: this.headers});

    constructor(private router: Router, private http: Http) {
    }

    isAdmin(): Observable<boolean> {       

        return this.http
          .get(
            environment.apiURL + '/users/role',
            this.options
          )
          .map(res => res.json())
          .map((res) => {
            if (res.role == 'admin') {
              return true;
            } else if (res.role == 'professor') {
              this.router.navigate(['/professor']);
              return false;
            } else if (res.role == 'student') {
              this.router.navigate(['/student']);
              return false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.router.navigate(['/login']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });
    }

    isProfessor(): Observable<boolean> {
        return this.http
          .get(
            environment.apiURL + '/users/role',
            this.options
          )
          .map(res => res.json())
          .map((res) => {
            if (res.role == 'admin') {
              return true;
            } else if (res.role == 'professor') {
              return true;
            } else if (res.role == 'student') {
              this.router.navigate(['/student']);
              return false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.router.navigate(['/login']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });
    }

    isStudent(): Observable<boolean> {
        return this.http
          .get(
            environment.apiURL + '/users/role',
            this.options
          )
          .map(res => res.json())
          .map((res) => {
            if (res.role == 'admin') {
              return true;
            } else if (res.role == 'professor') {
              return true;
            } else if (res.role == 'student') {
              return true;
            }
          })
          .catch((error) => {
            console.log(error);
            this.router.navigate(['/login']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });
    }

    isOutsider(): Observable<boolean> {
        
        return this.http
          .get(
            environment.apiURL + '/users/role',
            this.options
          )
          .map(res => res.json())
          .map((res) => {
            if (res.role == 'admin') {
              this.router.navigate(['/admin']);
            } else if (res.role == 'professor') {
              this.router.navigate(['/professor']);
            } else if (res.role == 'student') {
              this.router.navigate(['/student']);
            }
            alert(res.role);
            return false;
          })
          .catch((error) => {
            const state = new BehaviorSubject<boolean>(true);
            return state.asObservable();
           });
    }

    isLoggedIn(): Observable<boolean> {
        
        return this.http
          .get(
            environment.apiURL + '/users/role',
            this.options
          )
          .map(res => res.json())
          .map((res) => {
            if (res.role == 'admin') {
              this.router.navigate(['/admin']);
            } else if (res.role == 'professor') {
              this.router.navigate(['/professor']);
            } else if (res.role == 'student') {
              this.router.navigate(['/student']);
            }
            alert(res.role);
            return false;
          })
          .catch((error) => {
            this.router.navigate(['/login']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });
    }

}
