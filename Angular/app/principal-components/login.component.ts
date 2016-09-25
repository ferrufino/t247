/**
 * Created by ahinojosa on 13/09/16.
 */
import {Component, ElementRef} from '@angular/core';
import {AuthenticationService, User} from '../services/authentication.service'

@Component({
    selector: 'login-form',
    providers: [AuthenticationService],
    template: `
        <link type="text/css" rel="stylesheet" href="styles/estilosHomePage.css"/>
        <nav style="height:80px">
           <div class="nav-wrapper #4a148c purple darken-4">
               <a href="" class="brand-logo" id='logo'>Logo</a>
           </div>
        </nav>
        <div class="container" id="main">
              <div class="row">
               <div class="col s6">
                   <img src="styles/mientras.jpg" style="width:324px;height:258px; padding-top: 0px;">
               </div>
               <div class="col s6">
                   <h2>Welcome</h2>
                   <br><br>
                       <div class="row">
                            <div class="input-field col s12">
                                <input [(ngModel)]="user.email" id="email"
                                    type="email" class="validate">
                                <label for="email">Email</label>
                            </div>
                       </div>
                       <div class="row">
                           <div class="input-field col s12">
                                <input [(ngModel)]="user.password" id="password"
                                    type="password" class="validate">
                                <label for="password">Password</label>
                           </div>
                       </div>
                       <a href=""><h6>Forgot your password?</h6></a>
                       <br><br>
                       <span>{{errorMsg}}</span>
                       <button (click)="login()" class="btn waves-effect waves-light btn #4a148c purple darken-4 right"
                            type="submit" name="action">Login</button>
               </div>
              </div>
        </div>
        <footer class="page-footer N/A transparent">
          <div class="footer-copyright N/A transparent">
            <div class="container" id="footer">
                <img src="styles/tec.png" class="right">
            </div>
          </div>
        </footer>
    	`
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
        else{
          this._router.navigate(['']);
        }
      });
    }
}
