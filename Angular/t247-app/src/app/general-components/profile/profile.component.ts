import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import { Location }                 from '@angular/common';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = JSON.parse(sessionStorage.getItem('userJson'));

  editingProfile = false;
  constructor(private _authService: UsersService, private _editUserService:UsersService,
              private location: Location) {
    this.editingProfile = false;
  }

  ngOnInit() {
    this._authService.checkCredentials();
  }

  logout() {
      this._authService.logout();
  }

  editProfile(){
    this.editingProfile = true;
  }

  cancelEdit(){
    this.editingProfile = false;
  }

  onSubmit() {
    var llenado = true;
    if(this.user.enrollment===""){
      window.alert("Missing the enrollment");
      llenado=false;
    }
    if(this.user.first_name===""||this.user.first_name===null){
      window.alert("Missing first name");
      llenado=false;
    }
    if(this.user.last_name===""||this.user.last_name===null){
      window.alert("Missing last name");
      llenado = false;
    }
    if(this.user.email===""){
      window.alert("Missing email");
      llenado = false;
    }
    console.log(this.user);
    if(llenado){
      this.editingProfile = false;
      this._editUserService.editUser(this.user).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else{
          console.log(this.user);
          sessionStorage.setItem("userJson",JSON.stringify(this.user));
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
