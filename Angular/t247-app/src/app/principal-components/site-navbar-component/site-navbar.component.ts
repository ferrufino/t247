import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-site-navbar',
  templateUrl: './site-navbar.component.html',
  styleUrls: ['./site-navbar.component.css']
})
export class SiteNavbarComponent implements OnInit {

  @Input() availableRoles: string[];
  @Input() actualRole: string;
  @Output() clickedRole = new EventEmitter();
  @Output() callLogout = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * This function emits an event that triggers the logout function, the function that is called is
   * on the Home Component
   */
  sendLogoutEvent(){
    this.callLogout.emit();
  }

  testFunc(role) {
    this.clickedRole.emit(role);
  }

}
