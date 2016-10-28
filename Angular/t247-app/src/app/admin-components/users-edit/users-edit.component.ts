import { Component, OnInit, Input } from '@angular/core';
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

    ngOnInit () {
      this.route.params.forEach((params: Params) => {
          let id = +params['id'];
          this._authService.getUser(id)
          .subscribe(
            user => {
              console.log(user);
              this.userEdit = user;
            }
          );
        });

    }
    ngAfterViewInit() {


    }

    onSubmit() {
      console.log(this.userEdit);
      this._authService.editUser(this.userEdit).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else{
          console.log(this.userEdit);
        }
      });
    }

    goBack() {
      this.location.back();
    }

    logout() {
        this._authService.logout();
    }


}
