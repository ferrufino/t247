
import {Component, ElementRef} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from "../../user";

@Component({
    selector: 'login-form',
    templateUrl: './login.component.html',
    styleUrls: ['../../../styles/general-styles.css', './login.component.css']
})

export class LoginComponent {

  public user = new User();
  public errorMsg = '';

  constructor(
      private _service:UsersService) {}

  login() {
    this._service.login(this.user).subscribe(
      (result) => {
        if (!result) {
          this.errorMsg = 'Failed to login';
        }
      },
      err => {
        console.error(err);
      }
    );
  }
}
