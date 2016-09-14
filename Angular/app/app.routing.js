"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./principal-components/login.component');
var home_component_1 = require("./principal-components/home.component");
var my_assignments_component_1 = require("./user-components/my-assignments.component");
var appRoutes = [
    {
        path: '',
        component: home_component_1.HomeComponent
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    },
    {
        path: 'myAssignments',
        component: my_assignments_component_1.MyAssignments
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map