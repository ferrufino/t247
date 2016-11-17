import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {CoursesService} from '../../services/courses.service.ts';
import {TopicsService} from '../../services/topics.service.ts';
import {UsersService} from '../../services/users.service';
import {GroupsService} from '../../services/groups.service';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'generic-form',
  templateUrl: "./generic-form.component.html",
  styleUrls: ["./generic-form.component.css"]
})
export class GenericFormComponent implements OnInit  {
  finished:string="";
  courses:Array<any>;
  user:any = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
  topicName:string = "";
  courseName:string = "";
  group:any = {course: {id: "", name:""}, enrollmentText: "", period: ""};

    @Input('typeForm') typeOfForm:string;
    @Output() formChange = new EventEmitter();

    constructor(private topicsService:TopicsService,
                private coursesService:CoursesService,
                private usersService:UsersService,
                private groupsService:GroupsService,
                private _cacheService: CacheService) {
    }

    ngOnInit(){
      console.log(this.typeOfForm);
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
    }

    onSubmitCourse() {
        var llenado = true;
        if (this.courseName === "") {
            window.alert("Please type a course name");
            llenado = false;
        }
        console.log(this.courseName);
        if (llenado) {
            this.coursesService.createCourse(this.courseName).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.courseName = '';
                    this.formChange.emit();
                }
            });
        }
    }
    onSubmitUser() {
        var llenado = true;
        if (this.user.enrollment === "") {
            window.alert("Missing the enrollment");
            llenado = false;
        }
        if (this.user.first_name === "") {
            window.alert("Missing first name");
            llenado = false;
        }
        if (this.user.last_name === "") {
            window.alert("Missing last name");
            llenado = false;
        }
        if (this.user.role === "") {
            window.alert("Please choose a role");
            llenado = false;
        }
        if (this.user.email === "") {
            window.alert("Missing email");
            llenado = false;
        }
        if (this.user.password === "") {
            window.alert("Missing password");
            llenado = false;
        }
        if (llenado) {
            console.log(this.user);
            this.usersService.createUser(this.user).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.user = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
                    this.formChange.emit();
                }
            });
        }
    }
    onSubmitTopic() {
        var llenado = true;
        if (this.topicName === "") {
            window.alert("Please type a topic name");
            llenado = false;
        }
        console.log(this.topicName);
        if (llenado) {
            this.topicsService.createTopic(this.topicName).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.topicName = '';
                    this.formChange.emit();
                }
            });
        }
    }
    onSubmitGroup(){
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
          this.groupsService.createGroup(this.group).subscribe((result) => {
            if (!result) {
              console.log("Fallo");
            }
            else {
              console.log(result);
              //this.renderTable();
              this.group = {course: {id: "", name:""}, enrollmentText: "", period: ""};
              this.formChange.emit();
            }
          });
      }
    }

}
