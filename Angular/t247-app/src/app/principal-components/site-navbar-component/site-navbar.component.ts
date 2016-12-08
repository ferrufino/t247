import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-site-navbar',
  templateUrl: './site-navbar.component.html',
  styleUrls: ['./site-navbar.component.css']
})
export class SiteNavbarComponent implements OnInit {

  userRoles: string[];
  @Input() showDropdown: boolean;
  @Input() currentRole: string;

  constructor(private _authService: UsersService, private _router: Router) {
  }

  ngOnInit() {
    if (localStorage['roles'])    
      this.userRoles = JSON.parse(localStorage['roles']);


    if (localStorage['userJson'] && this.currentRole == '')
      this.currentRole = JSON.parse(localStorage['userJson'])['role'];

    console.log(this.userRoles);

  }

  /**
   * This function emits an event that triggers the logout function, the function that is called is
   * on the Home Component
   */
  sendLogoutEvent(){
    this._authService.logout();
  }

  testFunc(role) {
    this._router.navigate(['/' + role.toLowerCase()]);
  }

  navigateHome() {
    this._router.navigate(['/']);
  }

  navigateProfile() {
    this._router.navigate(['/profile']);
  }

}
