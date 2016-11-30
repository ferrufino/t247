import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {UsersService} from '../../services/users.service';
import { Location }                 from '@angular/common';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('userJson'));

  editingProfile = false;
  private form : FormGroup;

  constructor(private _authService: UsersService,
              private _editUserService:UsersService,
              private location: Location,
              private _formBuilder: FormBuilder) {
    this.editingProfile = false;
  }

  ngOnInit() {
    this._authService.checkCredentials();
    this.form = this._formBuilder.group({
      'user': this._formBuilder.group({
        'first_name': [this.user.first_name, Validators.required],
        'last_name': [this.user.last_name, Validators.required],
        'email': [this.user.email, Validators.required],
        'password': ['', Validators.required]
      })
    });
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
    let request = {
      "enrollment": this.form.value.user.enrollment,
      "first_name": this.form.value.user.first_name,
      "last_name": this.form.value.user.last_name,
      "role": this.form.value.user.role,
      "email": this.form.value.user.email,
      "password": this.form.value.user.password
    };
    console.log(request);
    this.editingProfile = false;
    this._editUserService.addUserInfoFirstTimeLogIn(request).subscribe((result) => {
      if (!result) {
        console.log("Fallo");
      }
      else{
        console.log(this.user);
        localStorage.setItem("userJson",JSON.stringify(this.user));
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
