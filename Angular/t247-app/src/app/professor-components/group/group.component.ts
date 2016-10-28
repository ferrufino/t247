import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location } from '@angular/common';
import { AssignmentComponent } from "../assignment/assignment.component";

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
              private _authService: UsersService) {

  }

  ngOnInit() {
    //this._authService.checkCredentials();
    this.route.data.forEach((group : any) => {
      this.group = group.any;
    });
  }

  goBack() {
    this.location.back();
  }

  onNewAssignment() {

  }
}
