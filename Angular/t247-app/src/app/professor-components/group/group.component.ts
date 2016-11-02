import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location } from '@angular/common';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import { CoursesService } from '../../services/courses.service.ts';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public group;
  constructor(private _service: GroupsService,
              private route: ActivatedRoute,
              private location: Location,
              private _authService: UsersService,
              private coursesService: CoursesService,
              private _cacheService: CacheService) {

  }

  ngOnInit() {
    this._authService.checkCredentials();
    this.route.data.forEach((group : any) => {
      this.group = group.any;
      console.log(this.group);
      var enrollmentText = "";
      this.group.students.forEach(function(element){
        enrollmentText+=element.enrollment+",";
      });
      this.group.enrollmentText = enrollmentText;
    });
  }

  goBack() {
    this.location.back();
  }

}
