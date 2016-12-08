import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/mergeMap'; 

@Injectable()
export class AuthService {
    
    constructor(private router: Router, private http: Http) {
    }

    isAdmin(): Observable<boolean> {       
        
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
          .get(
            environment.apiURL + '/users/role',
            options
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
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
          .get(
            environment.apiURL + '/users/role',
            options
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

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
          .get(
            environment.apiURL + '/users/role',
            options
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

    isValidProblem(problem_id): Observable<boolean> {

        console.log("PROBLEM ID");
        console.log(problem_id);

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
              environment.apiURL + '/problems/description/' + problem_id,
              options
            )
            .map(res => res.json())
            .map((res) => {
              console.log("SEGUNDA RESPUESTA");
              return true;
            })
            .catch((error) => {
            console.log(error);
            this.router.navigate(['/']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });

    }

    isProblemExistent(problem_id): Observable<boolean> {

        console.log("PROBLEM ID");
        console.log(problem_id);

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
              environment.apiURL + '/problems/' + problem_id,
              options
            )
            .map(res => res.json())
            .map((res) => {
              console.log("SEGUNDA RESPUESTA");
              return true;
            })
            .catch((error) => {
            console.log(error);
            this.router.navigate(['/']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });

    }

    isValidTopic(topic_id): Observable<boolean> {

        console.log("TOPIC ID");
        console.log(topic_id);

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
              environment.apiURL + '/topics/' + topic_id,
              options
            )
            .map(res => res.json())
            .map((res) => {
              console.log("SEGUNDA RESPUESTA TOPIC");
              return true;
            })
            .catch((error) => {
            console.log(error);
            this.router.navigate(['/']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });

    }

    isValidGroup(group_id): Observable<boolean> {

        console.log("GROUP ID");
        console.log(group_id);

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
              environment.apiURL + '/groups/' + group_id,
              options
            )
            .map(res => res.json())
            .map((res) => {
              console.log("SEGUNDA RESPUESTA GROUP");
              return true;
            })
            .catch((error) => {
            console.log(error);
            this.router.navigate(['/']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });

    }

    isValidAssignmentStudent(assignment_id, student_id): Observable<boolean> {

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
              environment.apiURL + '/assignments/student/' + assignment_id + '/' + student_id,
              options
            )
            .map(res => res.json())
            .map((res) => {
              console.log("SEGUNDA RESPUESTA GROUP");
              return true;
            })
            .catch((error) => {
            console.log(error);
            this.router.navigate(['/']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });

    }

    isOutsider(): Observable<boolean> {

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});
        
        return this.http
          .get(
            environment.apiURL + '/users/role',
            options
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
            
            return false;
          })
          .catch((error) => {
            const state = new BehaviorSubject<boolean>(true);
            return state.asObservable();
           });
    }

    isLoggedIn(): Observable<boolean> {

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});
        
        return this.http
          .get(
            environment.apiURL + '/users/role',
            options
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

            return false;
          })
          .catch((error) => {
            this.router.navigate(['/login']);
            const state = new BehaviorSubject<boolean>(false);
            return state.asObservable();
           });
    }

}
