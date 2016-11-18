import {
    Component,
    OnInit,
    AfterViewInit
} from '@angular/core';
import {RoleChangeService} from '../../services/role-change.service';
import {UsersService} from '../../services/users.service';
import { Subscription }   from 'rxjs/Subscription';

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

    constructor(private _service:UsersService, private _roleChange:RoleChangeService) {
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

        if (sessionStorage.getItem("auth_token")) {
            this.userRoles = JSON.parse(sessionStorage.getItem("roles"));
            this.userInformationObject = JSON.parse(sessionStorage.getItem("userJson"));
            this.typeOfUser = this.userInformationObject.role

            this.selectedRole = JSON.parse(sessionStorage.getItem("currentRoleView"));

            this.tabsLoadedFunction(); // Load the correct tabs for the user
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
