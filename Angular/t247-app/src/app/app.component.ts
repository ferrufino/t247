import {
    Component,
    OnInit,
    AfterViewInit
} from '@angular/core';
import {UsersService} from './services/users.service';
import {RoleChangeService} from './services/role-change.service';
import {Router} from '@angular/router';

@Component({
    selector: 'my-app',
    template: `
    <app-site-navbar [availableRoles]="userRoles" [showDropdown]="showDropdown" [actualRole]="currentRole"
   		(clickedRole)="changeSelectedRole($event)" (callLogout)="logout()"></app-site-navbar>
   	<router-outlet></router-outlet>
 	`
})


export class  AppComponent implements OnInit {
    title = 'Bit by bit';

    private userInformationObject:any;
    userRoles:string[];
    currentRole:string;
    typeOfUser:string;
    showDropdown:boolean;

    constructor(private _service:UsersService, private _roleChange:RoleChangeService, private _router : Router) {
    	this.userInformationObject = null;
    	this.userRoles = [];
    	this.currentRole = null;
    	this.typeOfUser = null;
    	this.showDropdown = false;
    }

    ngOnInit() {
    	alert("token: " + localStorage.getItem("auth_token"));
        if (localStorage.getItem("auth_token")) {
            this.userInformationObject = JSON.parse(localStorage.getItem("userJson"));
            this.userRoles = JSON.parse(localStorage.getItem("roles"));
            this.typeOfUser = this.userInformationObject.role


            // Check if a role view is stored in local storage
            if (localStorage.getItem("currentRoleView")) {

                this.currentRole = JSON.parse(localStorage.getItem("currentRoleView"));

            } else {
                this.currentRole = this.userInformationObject["role"];
                // Store current role-view
                localStorage.setItem('currentRoleView', JSON.stringify(this.currentRole));
            }

            //alert(this.currentRole);

            this.showDropdown = true;

        } 

    }

    /**
     * Set the selected  role to the one that was clicked on the Nav bar
     * @param role
     */
    changeSelectedRole(role) {
    	//alert(role);
        this.currentRole = role;
        localStorage.setItem('currentRoleView', JSON.stringify(role));
        this._router.navigate(['']);
        this._roleChange.sendNewRole(role);
    }

    logout() {
        this._service.logout();
    }

}
