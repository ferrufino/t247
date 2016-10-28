import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'home',
  providers: [UsersService],
  templateUrl: './home.component.html',
  styleUrls: ['../../../styles/general-styles.css']
})

export class HomeComponent implements OnInit, AfterViewInit {

  roles: [string];
  selectedRole: string;
  adminTabsLoaded: boolean;
  professorTabsLoaded: boolean;
  studentTabsLoaded: boolean;

  constructor(private _service: UsersService) {
    this.adminTabsLoaded = false;
    this.professorTabsLoaded = false;
    this.studentTabsLoaded = false;
  }

  ngOnInit() {

    this._service.checkCredentials();
    if (sessionStorage.getItem("auth_token")) {
      this.roles = JSON.parse(sessionStorage.getItem("roles"));
      this.selectedRole = JSON.parse(sessionStorage.getItem("roles"))[0];
      this.tabsLoadedFunction();
    }

    //TODO: DELETE THIS LINE
    this.selectedRole = "admin";
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

  changeSelectedRole(role) {
    var index = this.roles.indexOf(role);
    this.selectedRole = this.roles[index];
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
