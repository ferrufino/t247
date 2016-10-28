import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location } from '@angular/common';
import { AssignmentComponent } from "../assignment/assignment.component";
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
  public courses;
  constructor(private _service: GroupsService,
              private route: ActivatedRoute,
              private location: Location,
              private _authService: UsersService,
              private coursesService: CoursesService,
              private _cacheService: CacheService) {

  }

  ngOnInit() {
    this.coursesService.getCourses().subscribe(
      courses => {
        if (!this._cacheService.exists('courses')) {
          const myArray = [];
          for (let key in courses) {
            myArray.push(courses[key]);
            console.log(courses[key]);
          }
          this._cacheService.set('courses', myArray, {maxAge: environment.lifeTimeCache});
          this.courses = this._cacheService.get('courses');
          //console.log("Se hizo get de courses");
        }
        else {
          this.courses = this._cacheService.get('courses');
        }
      }
    );
    //this._authService.checkCredentials();
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

  onSubmit() {
    var llenado = true;
    this.group.courseId = this.group.course.id;
    if(this.group.courseId===""){
      window.alert("Favor de escoger un curso");
      llenado=false;
    }
    if(this.group.enrollmentText===""){
      window.alert("Favor de dar de alta estudiantes");
      llenado=false;
    }
    if(this.group.period===""){
      window.alert("Favor de escribir un periodo");
      llenado = false;
    }
    this.group.courseId = Number(this.group.courseId);
    this.group.enrollments=this.group.enrollmentText.split(",");
    this.group.professor = JSON.parse(sessionStorage.getItem('userJson')).id;
    if(llenado){
      console.log(this.group);
      this._service.editGroup(this.group).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else{
          console.log(result);
        }
      });
    }
  }

  onNewAssignment() {

  }

}
