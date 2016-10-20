import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'home',
  providers: [AuthenticationService],
  templateUrl: './home.component.html',
  styleUrls: ['../../../styles/general-styles.css']
})

export class HomeComponent implements OnInit, AfterViewInit{
  roles: [string];
  selectedRole : string;
  adminTabsLoaded : boolean;
  professorTabsLoaded : boolean;
  studentTabsLoaded : boolean;

    title = 'Angular Nav Tabs';

    constructor(
    private _service: AuthenticationService){
    this.adminTabsLoaded = false;
    this.professorTabsLoaded = false;
    this.studentTabsLoaded = false;
  }

  ngOnInit(){

    this._service.checkCredentials();
    if(sessionStorage.getItem("auth_token")){
      this.roles = JSON.parse(sessionStorage.getItem("roles"));
      this.selectedRole = JSON.parse(sessionStorage.getItem("roles"))[0];
      this.tabsLoadedFunction();
    }
  }

  logout() {
    this._service.logout();
  }

  ngAfterViewInit() {
  }

  changeSelectedRole(role){
    var index = this.roles.indexOf(role);
    this.selectedRole = this.roles[index];
    this.adminTabsLoaded = false;
    this.professorTabsLoaded = false;
    this.studentTabsLoaded = false;
    this.tabsLoadedFunction();
  }
  tabsLoadedFunction(){
    switch(this.selectedRole){
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
