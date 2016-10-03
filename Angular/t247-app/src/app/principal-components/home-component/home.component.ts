import {Component} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service'

@Component({
    selector: 'home',
    providers: [AuthenticationService],
    templateUrl: './home.component.html',
    styleUrls: ['../../../styles/general-styles.css']
})

export class HomeComponent {
  roles: [string]
  selectedRole : string
  constructor(
      private _service: AuthenticationService){}

    ngOnInit(){
        this._service.checkCredentials();
        if(localStorage.getItem("user")){
            this.roles = JSON.parse(localStorage.getItem("user")).roles;
            this.selectedRole = JSON.parse(localStorage.getItem("user")).roles[0];
        }
        $(".dropdown-button").dropdown();
        $(".dropdown-button-mobile").dropdown();
    }

    logout() {
        this._service.logout();
    }

    ngAfterViewInit() {
        $('select').material_select();
    }

    logout() {
        this._service.logout();
    }

    changeSelectedRole(role){
        var index = this.roles.indexOf(role);
        this.selectedRole = this.roles[index];
  }
}
