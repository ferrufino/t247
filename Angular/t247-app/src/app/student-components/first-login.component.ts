import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms"
import {UsersService} from '../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent implements OnInit {

  constructor(private _authService: UsersService,
              private _router: Router) { }

  public userEdit;

  ngOnInit() {
    this._authService.checkCredentials();
    // Getting data of the current user
    // Currently there is no user logged in
    /*
    let userInfo = JSON.parse(localStorage.getItem("userJson"));
    this._authService.getUser(userInfo.id)
      .subscribe(
        user => {
          console.log("desde first login");
          console.log(user);
          this.userEdit = user;
        }
      );
      */
  }

  onSubmit(form: NgForm) {
    this.userEdit.first_name = form.value.first_name
    this.userEdit.last_name = form.value.last_name
    this.userEdit.email = form.value.email
    this.userEdit.password = form.value.password
    this._authService.addUserInfoFirstTimeLogIn(this.userEdit).subscribe((result) => {
      if (!result) {
        console.log("Fallo");
      }
      else{
        this._router.navigate(['']);
        console.log(this.userEdit);
      }
    });
  }

}
