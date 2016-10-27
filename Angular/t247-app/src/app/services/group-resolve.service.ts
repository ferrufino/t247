import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { GroupsService } from './groups.service';

@Injectable()
export class GroupResolve implements Resolve<any> {

  constructor(private gs : GroupsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    let id = +route.params['id'];
    return this.gs.getGroup(id).map(group => {
      if (group) {
        return group;
      } else { // id not found
        this.router.navigate(['/']);
        return false;
      }
    });
  }
}
