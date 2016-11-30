import {Component, ElementRef, EventEmitter} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from "../../user";
import {Router} from '@angular/router';

@Component({
    selector: 'login-form',
    templateUrl: './login.component.html',
    styleUrls: ['../../../styles/general-styles.css', './login.component.css']
})

export class LoginComponent {

  public user = new User();
  public errorMsg = '';
  private failedLogin = false;
  private serverError = false;

  constructor(private _service:UsersService, private _router : Router) {

  }

  ngOnInit() {

    // TODO: instead of checking
    //if (localStorage.getItem("auth_token")) {
    //  this._router.navigate(['admin']);
    //}

  }

  login() {
      this._service.login(this.user).subscribe(
      (result) => {
        if (!result) {
          this.errorMsg = 'Failed to login';
        } else {
          console.log("LOGIN");
          console.log(result);
        }
      },
      err => {
        if (err.status == 401) {
          this.failedLogin = true;
        } else {
          this.serverError = true;
        }
        console.error(err);
      }
    );
  }
    eventHandler(keyCode) {
        if(keyCode == "13"){
            this.login();
        }
    }

}
