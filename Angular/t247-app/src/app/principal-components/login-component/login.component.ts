
import {Component, ElementRef} from '@angular/core';
import {AuthenticationService, User} from '../../services/authentication.service'

@Component({
    selector: 'login-form',
    providers: [AuthenticationService],
    templateUrl: './login.component.html',
    styleUrls: ['../../../styles/general-styles.css', './login.component.css']
})

export class LoginComponent {

  public user = new User('','',['']);
  public errorMsg = '';

  constructor(
      private _service:AuthenticationService) {}

  login() {
    this._service.login(this.user).subscribe((result) => {
      if (!result) {
        this.errorMsg = 'Failed to login';
      }
    });
  }
}
