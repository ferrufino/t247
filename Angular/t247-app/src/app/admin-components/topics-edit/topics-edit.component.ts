import { Component, OnInit, Input } from '@angular/core';
import { Response } from "@angular/http";
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { TopicsService } from '../../services/topics.service.ts';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'topics-edit',
  templateUrl: './topics-edit.component.html',
  styleUrls: ['./topics-edit.component.css']
})
export class TopicsEditComponent implements OnInit{

    constructor(private topicsService : TopicsService,
                private route: ActivatedRoute,
                private location: Location,
                private _authService: UsersService) {}


    topic;

    ngOnInit () {
      this.route.params.forEach((params: Params) => {
          let id = +params['id'];
          this.topicsService.getTopic(id)
          .subscribe(
            topic => {
              console.log(topic);
              this.topic = topic;
            }
          );
        });

    }
    ngAfterViewInit() {


    }

    onSubmit() {
      console.log(this.topic);
      this.topicsService.editTopic(this.topic).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else{
          console.log(result);
        }
      });
    }

    logout() {
        this._authService.logout();
    }

    goBack() {
      this.location.back();
    }


}
