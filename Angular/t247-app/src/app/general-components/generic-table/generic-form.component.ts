import { Component, Input, OnInit } from '@angular/core';
import {CoursesService} from '../../services/courses.service.ts';
import {TopicsService} from '../../services/topics.service.ts';
import {GroupsService} from "../../services/groups.service";
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent implements OnInit  {

  courses:Array<any>;
  user:any = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
  topicName:string = "";
  courseName:string = "";
  group:any = {course: {id: "", name:""}, enrollmentText: "", period: ""};

    @Input('typeForm') typeOfForm:string;


    constructor(private topicsService:TopicsService,
                private coursesService:CoursesService,
                private usersService:UsersService) {
    }

    ngOnInit(){
      console.log(this.typeOfForm);
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
                    // this.renderTable();
                    this.courseName = '';
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
                    // this.renderTable();
                    this.user = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
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
                    // this.renderTable();
                    this.topicName = '';
                }
            });
        }
    }

}
