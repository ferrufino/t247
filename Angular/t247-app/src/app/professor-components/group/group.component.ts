import { Component, OnInit } from '@angular/core';
import {GroupsService} from '../../services/groups.service';
import { Location } from '@angular/common';

@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  private id : number = 0;
  constructor(private _service GroupsService, id) {
    this.id = id;
  }

  ngOnInit() {
    //this._authService.checkCredentials();
    this._service.getGroup(this.id)
  }

  goBack() {
    this.location.back();
  }
}
