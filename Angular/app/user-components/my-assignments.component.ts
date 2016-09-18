/**
 * Created by ahinojosa on 14/09/16.
 */

import { Component } from '@angular/core';
import {Route, Router} from "@angular/router";

@Component({
    selector: 'my-assignments',
    templateUrl: 'app/user-components/templates/my-assignments.component.html'
})

export class MyAssignments {
    title = 'Test';
    constructor(
        private _router: Router){}
}
