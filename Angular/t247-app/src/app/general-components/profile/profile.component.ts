import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../user';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'profile',
  providers: [AuthenticationService,UserService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = JSON.parse(sessionStorage.getItem('userJson'));

  editingProfile = false;

  constructor(private _authService: AuthenticationService, private _editUserService:UserService) {
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
    console.log(this._editUserService.editUser(this.user));
  }
}
