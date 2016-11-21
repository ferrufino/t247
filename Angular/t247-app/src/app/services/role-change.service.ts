import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
@Injectable()
export class RoleChangeService {
  // Observable string sources
  private mostRecentRole = new Subject<string>();
  
  // Observable string streams
  role$ = this.mostRecentRole.asObservable();

  // Service message commands
  sendNewRole(role: string) {
    this.mostRecentRole.next(role);
  }
}