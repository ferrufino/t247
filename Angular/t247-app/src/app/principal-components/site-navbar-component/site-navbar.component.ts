import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-site-navbar',
  templateUrl: './site-navbar.component.html',
  styleUrls: ['./site-navbar.component.css']
})
export class SiteNavbarComponent implements OnInit {

  @Input() availableRoles: string[];
  @Input() showDropdown: boolean;
  @Input() actualRole: string;
  @Output() clickedRole = new EventEmitter();

  constructor(private _authService: UsersService) {
  }

  ngOnInit() {
  }

  /**
   * This function emits an event that triggers the logout function, the function that is called is
   * on the Home Component
   */
  sendLogoutEvent(){
    this._authService.logout();
  }

  testFunc(role) {
    this.clickedRole.emit(role);
  }

}
