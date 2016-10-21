import { Component, OnInit, Input } from '@angular/core';
import { Response } from "@angular/http";
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { CoursesService } from '../../services/courses.service.ts';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  providers: [AuthenticationService],
  selector: 'courses-edit',
  templateUrl: './courses-edit.component.html',
  styleUrls: ['./courses-edit.component.css']
})
export class CoursesEditComponent implements OnInit{

    constructor(private coursesService : CoursesService,
                private route: ActivatedRoute,
                private location: Location,
                private _authService: AuthenticationService) {}

    course;

    ngOnInit () {
      this.route.params.forEach((params: Params) => {
          let id = +params['id'];
          this.coursesService.getCourse(id)
          .subscribe(
            course => {
              console.log(course);
              this.course = course;
            }
          );
        });

    }
    ngAfterViewInit() {


    }

    onSubmit() {
      console.log(this.course);
      this.coursesService.editCourse(this.course).subscribe((result) => {
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
