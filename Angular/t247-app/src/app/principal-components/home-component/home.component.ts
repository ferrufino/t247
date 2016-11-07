import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from "../../user";

@Component({
  selector: 'home',
  providers: [UsersService],
  templateUrl: './home.component.html',
  styleUrls: ['../../../styles/general-styles.css']
})

export class HomeComponent implements OnInit, AfterViewInit {

  private userInformationObject: any;
  userRoles: [string];
  selectedRole: string;
  adminTabsLoaded: boolean;
  professorTabsLoaded: boolean;
  studentTabsLoaded: boolean;

  constructor(private _service: UsersService) {
    this.adminTabsLoaded = false;
    this.professorTabsLoaded = false;
    this.studentTabsLoaded = false;
    this.userInformationObject = null;
  }

  ngOnInit() {

    this._service.checkCredentials(); // Check if the user is logged in

    if (sessionStorage.getItem("auth_token")) {
      this.userRoles = JSON.parse(sessionStorage.getItem("roles"));
      this.userInformationObject = JSON.parse(sessionStorage.getItem("userJson"));

      // if the user manually type the url to get in here without filling his information
      // we must kick him out
      if (this.userInformationObject.first_name === null) {
        this._service.logout();
      }

      // Check if a role view is stored in local storage
      if(sessionStorage.getItem("currentRoleView")){

        this.selectedRole = JSON.parse(sessionStorage.getItem("currentRoleView"));

      } else {

        this.selectedRole = this.userInformationObject["role"];
        // Store current role-view
        sessionStorage.setItem('currentRoleView', JSON.stringify(this.selectedRole));
      }


      this.tabsLoadedFunction(); // Load the correct tabs for the user
    }

  }

  logout() {
    this._service.logout();
  }

  ngAfterViewInit() {
  }

  /**
   * Set the selected  role to the one that was clicked on the Nav bar
   * @param role
   */
  changeSelectedRole(role) {
    this.selectedRole = role;
    sessionStorage.setItem('currentRoleView', JSON.stringify(role));
    this.adminTabsLoaded = false;
    this.professorTabsLoaded = false;
    this.studentTabsLoaded = false;
    this.tabsLoadedFunction();
  }

  tabsLoadedFunction() {
    switch (this.selectedRole) {
      case 'admin':
        this.adminTabsLoaded = true;
        break;
      case 'professor':
        this.professorTabsLoaded = true;
        break;
      case 'student':
        this.studentTabsLoaded = true;
        break;
    }
  }
}
