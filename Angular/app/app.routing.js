"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./principal-components/login.component');
var home_component_1 = require("./principal-components/home.component");
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
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map