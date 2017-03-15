import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UserEditComponent implements OnInit{

    constructor(private _authService: UsersService) {}


    public userEdit;
    @Output() refresh = new EventEmitter();

    ngOnInit () {
    }

    ngAfterViewInit() {
    }

    setUser(userId) {
      this._authService.getUser(userId)
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

    resetPassword() {
      this._authService.resetPassword(this.userEdit)
          .subscribe((result) => {
              if (!result) {
                alert("Password reset failed. Please try again later");
              } else {
                console.log(this.userEdit);
              }
          });
    }
}
