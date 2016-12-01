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
   	<router-outlet></router-outlet>
 	`
})


export class  AppComponent {
    title = 'Bit by bit';
}
