import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms"
import {UsersService} from '../services/users.service';
import {User} from "../user";

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent {

  constructor(private _service:UsersService) { }

  public userEdit = new User();

  onSubmit(form: NgForm) {
    // TODO: validate that all fields contain information
    this.userEdit.first_name = form.value.first_name;
    this.userEdit.last_name = form.value.last_name;
    this.userEdit.email = form.value.email;
    this.userEdit.password = form.value.password;
    this.userEdit.id = Number((<HTMLInputElement>document.getElementById("id")).value)
    this._service.addUserInfoFirstTimeLogIn(this.userEdit).subscribe((result) => {
      if (!result) {
        console.log("Fallo");
      }
      else{
        this._service.login(this.userEdit).subscribe(
          (result) => {
            if (!result) {
              alert("Failed to login");
            }
            document.getElementById("openModalButton").click();
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  }

}
