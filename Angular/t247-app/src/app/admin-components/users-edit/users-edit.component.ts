import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Response } from "@angular/http";
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UserEditComponent implements OnInit{

    constructor(private route: ActivatedRoute,
                private location: Location,
                private _authService: UsersService) {}


    public userEdit;
    @Output() refresh = new EventEmitter();
    ngOnInit () {
      /*let id = this.userId;
      this._authService.getUser(id)
      .subscribe(
        user => {
          console.log(user);
          this.userEdit = user;
        }
      );*/
    }

    ngAfterViewInit() {


    }

    setUser(userID) {
      this._authService.getUser(userID)
        .subscribe(user => {
          console.log(user);
          this.userEdit = user;
        });
    }

    onSubmit() {
      var llenado = true;
      if(this.userEdit.enrollment===""){
        window.alert("Missing the enrollment");
        llenado=false;
      }
      if(this.userEdit.first_name===""||this.userEdit.first_name===null){
        window.alert("Missing first name");
        llenado=false;
      }
      if(this.userEdit.last_name===""||this.userEdit.last_name===null){
        window.alert("Missing last name");
        llenado = false;
      }
      if(this.userEdit.email===""){
        window.alert("Missing email");
        llenado = false;
      }
      console.log(this.userEdit);
      if(llenado){
        this._authService.editUser(this.userEdit).subscribe((result) => {
          if (!result) {
            console.log("Fallo");
          }
          else{
            console.log(this.userEdit);
            this.refresh.emit();
          }
        });
      }
    }

    goBack() {
      this.location.back();
    }

    logout() {
        this._authService.logout();
    }

    editUser(){


    }

}
