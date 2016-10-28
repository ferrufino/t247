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
      this.selectedRole = this.userInformationObject["role"];

      this.tabsLoadedFunction(); // Load the correct tabs for the user
    }

  }

  logout() {
    //this._service.logout();
    this._service.request_logout().subscribe(
      data => {
        console.log('Successfully logged out');
        console.log(data);
        sessionStorage.removeItem("email_user");
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("userJson");
        localStorage.removeItem("email_user");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("userJson");
        this._service.complete_logout();
      },
      err => {
        console.error(err);
      }
    );

  }

  ngAfterViewInit() {
  }

  /**
   * Set the selected  role to the one that was clicked on the Nav bar
   * @param role
   */
  changeSelectedRole(role) {
    this.selectedRole = role;
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
