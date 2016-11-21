import {
    Component,
    OnInit,
    AfterViewInit
} from '@angular/core';
import {RoleChangeService} from '../../services/role-change.service';
import {UsersService} from '../../services/users.service';
import { Subscription }   from 'rxjs/Subscription';
import {Router} from '@angular/router';

@Component({
    selector: 'home',
    providers: [UsersService],
    templateUrl: './home.component.html',
    styleUrls: ['../../../styles/general-styles.css']
})

export class HomeComponent implements OnInit, AfterViewInit {

    private userInformationObject:any;
    userRoles:[string];
    selectedRole:string;
    adminTabsLoaded:boolean;
    professorTabsLoaded:boolean;
    studentTabsLoaded:boolean;
    typeOfUser:string;
    subscription: Subscription;

    constructor(private _service:UsersService, private _roleChange:RoleChangeService, private _router : Router) {
        this.adminTabsLoaded = false;
        this.professorTabsLoaded = false;
        this.studentTabsLoaded = false;
        this.userInformationObject = null;
        this.subscription = _roleChange.role$.subscribe(
          role => {
            this.changeSelectedRole(role);
        });
    }

    ngOnInit() {

        if (localStorage.getItem("auth_token")) {
            this.userRoles = JSON.parse(localStorage.getItem("roles"));
            this.userInformationObject = JSON.parse(localStorage.getItem("userJson"));
            this.typeOfUser = this.userInformationObject.role

            this.selectedRole = JSON.parse(localStorage.getItem("currentRoleView"));

            this.tabsLoadedFunction(); // Load the correct tabs for the user
        } else {
            this._router.navigate(["login"]);
        }

    }

    ngAfterViewInit() {
    }

    /**
     * Set the selected  role to the one that was clicked on the Nav bar
     * @param role
     */
    changeSelectedRole(role) {

        this.selectedRole = role;
        localStorage.setItem('currentRoleView', JSON.stringify(role));
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
