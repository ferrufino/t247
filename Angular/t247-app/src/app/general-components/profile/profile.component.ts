import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../user';
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
    console.log(this.user);
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

  goBack() {
    this.location.back();
  }
}
