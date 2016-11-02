import {Component, OnInit, Input} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {Response} from "@angular/http";
import {Router} from '@angular/router';
import {CoursesService} from '../../services/courses.service.ts';
import {TopicsService} from '../../services/topics.service.ts';
import {GroupsService} from "../../services/groups.service";
import {CacheService, CacheStoragesEnum} from 'ng2-cache/ng2-cache';
import {AssignmentsService} from '../../services/assignments.service';
import {environment} from '../../../environments/environment';
import {UsersService} from '../../services/users.service';
import {SubmitProblemService} from '../../services/submit-problem.service';
import {ProblemsService} from '../../services/problems.service';
@Component({
    selector: 'generic-table',
    templateUrl: './generic-table.component.html',
    styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit {

    courses:Array<any>;
    user:any = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
    topicName:string = "";
    courseName:string = "";
    group:any = {courseId: "", enrollmentText: "", period: ""};

    constructor(private topicsService:TopicsService,
                private coursesService:CoursesService,
                private groupsService:GroupsService,
                private assignmentsService:AssignmentsService,
                private router:Router,
                private _cacheService:CacheService,
                private usersService:UsersService,
                private submissionOfProblems:SubmitProblemService,
                private problemsService: ProblemsService) {
    }

    @Input('typetable') typeOfTableName:string;
    @Input('assignment') assignmentId:number;
    //typeOfTableName: string = "courses";
    columns:Array<string>;
    private problemsBool;
    private assignmentsBool;
    private submissionsBool;
    private assignmentSubmissionsBool;
    private groupsBool;
    private coursesBool;
    private topicsBool;
    private usersBool;

    content:any[] = [];

    ngOnInit() {
        this.renderTable();

    }

    ngAfterViewInit() {


    }


    renderTable() {
        this.problemsBool = false;
        this.assignmentsBool = false;
        this.submissionsBool = false;
        this.assignmentSubmissionsBool = false;
        this.groupsBool = false;
        this.coursesBool = false;
        this.topicsBool = false;
        this.usersBool = false;

        switch (this.typeOfTableName) {

            case "problems":
                this.problemsService.getProblems().subscribe(
                    submissions => {
                        console.log(submissions);
                        this.content = submissions;
                        this.problemsBool = true;
                        this.columns = ["Title", "Difficulty", "Active", "Change Status", "Edit", "Delete"];
                    }
                );
                break;

            case "assignments":
                this.assignmentsBool = true;
                this.columns = ["Title", "Class", "Topic", "Due Date", "Completed"];
                this.content = [
                    {
                        "title": "dummyProblem",
                        "class": "Algorithms",
                        "topic": "Hero 1",
                        "duedate": '3/4/2016',
                        "completed": false
                    },
                    {
                        "title": "dummyProblem",
                        "class": "Data Structure",
                        "topic": "Hero 1",
                        "duedate": '3/4/2016',
                        "completed": false
                    },
                    {
                        "title": "dummyProblem",
                        "class": "Database",
                        "topic": "Hero 1",
                        "duedate": '3/4/2016',
                        "completed": false
                    }
                ];
                break;

            case "submissions":
                this.submissionOfProblems.getSubmissions().subscribe(
                 submissions => {
                     this.submissionsBool = true;
                     this.columns = ["Name", "Number of Attempts", "Solved"];
                     this.content = submissions;
                 }
                );


                break;

            case "assignmentSubmissions":
                this.assignmentsService.getSubmissions(this.assignmentId).subscribe(
                    submissions => {
                        debugger;
                        this.content = submissions;
                        this.assignmentSubmissionsBool = true;
                        this.columns = ["Student", "Date of last submission", "Attempts", "Solved"];
                    }
                );
                break;

            case "groups":
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
                this.groupsService.getGroups().subscribe(
                    groups => {
                        if (!this._cacheService.exists('groups')) {
                            const myArray = [];
                            for (let key in groups) {
                                myArray.push(groups[key]);
                                console.log(groups[key]);
                            }
                            this._cacheService.set('groups', myArray, {maxAge: environment.lifeTimeCache});
                            this.content = this._cacheService.get('groups');
                            //console.log("Se hizo get de groups");
                        }
                        else {
                            this.content = this._cacheService.get('groups');
                        }
                        this.groupsBool = true;
                        this.columns = ["Id", "Name", "Period", "Edit", "Delete"];
                    }
                );
                break;

            case "courses":
                this.coursesService.getCourses().subscribe(
                    courses => {
                        if (!this._cacheService.exists('courses')) {
                            const myArray = [];
                            for (let key in courses) {
                                myArray.push(courses[key]);
                                console.log(courses[key]);
                            }
                            this._cacheService.set('courses', myArray, {maxAge: environment.lifeTimeCache});
                            this.content = this._cacheService.get('courses');
                            //console.log("Se hizo get de courses");
                        }
                        else {
                            this.content = this._cacheService.get('courses');
                        }
                        this.coursesBool = true;
                        this.columns = ["Id", "Title", "Edit", "Delete"];
                    }
                );
                break;

            case "topics":
                if (!this._cacheService.exists('topics')) {
                    this.topicsService.getTopics().subscribe(
                        topics => {
                            const myArray = [];
                            for (let key in topics) {
                                myArray.push(topics[key]);
                                console.log(topics[key]);
                            }
                            this._cacheService.set('topics', myArray, {maxAge: environment.lifeTimeCache});
                            this.content = this._cacheService.get('topics');
                            //console.log("Se hizo get de topics");
                        }
                    );
                }
                else {
                    this.content = this._cacheService.get('topics');
                }
                this.topicsBool = true;
                this.columns = ["Id", "Title", "Edit", "Delete"];
                break;

            case "users":
                this.usersBool = true;
                this.columns = ["Enrollment Id", "First Name", "Last Name", "Type Of User", "Edit", "Delete"];
                if (!this._cacheService.exists('users')) {
                    this.usersService.getUsers().subscribe(
                        users => {
                            const myArray = [];
                            for (let key in users) {
                                myArray.push(users[key]);
                                console.log(users[key]);
                            }
                            console.log(myArray);
                            this._cacheService.set('users', myArray, {maxAge: environment.lifeTimeCache});
                            this.content = this._cacheService.get('users');
                        }
                    );
                }
                else {
                    this.content = this._cacheService.get('users');
                }

                break;

        }

    }

    onSelectGroup(group) {
        this.router.navigate(['/groups', group.id]);
    }

    onSelectTopic(topic) {
        this.router.navigate(['/editTopic', topic.id]);
    }

    onDeleteTopic(topic) {
        var r = confirm("Are you sure?");
        if (r == true) {
            console.log(topic);
            this.topicsService.deleteTopic(topic).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.renderTable();
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
                    this.renderTable();
                    this.topicName = '';
                }
            });
        }
    }

    onSelectCourse(course) {
        this.router.navigate(['/editCourse', course.id]);
    }

    onDeleteCourse(course) {
        var r = confirm("Are you sure?");
        if (r == true) {
            console.log(course);
            this.coursesService.deleteCourse(course).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.renderTable();
                }
            });
        }
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
                    this.renderTable();
                    this.courseName = '';
                }
            });
        }
    }

    onSubmitGroup() {
        var llenado = true;
        if (this.group.courseId === "") {
            window.alert("Please choose a course");
            llenado = false;
        }
        if (this.group.enrollmentText === "") {
            window.alert("Please register students");
            llenado = false;
        }
        if (this.group.period === "") {
            window.alert("Please write a period");
            llenado = false;
        }
        this.group.courseId = Number(this.group.courseId);
        this.group.enrollments = this.group.enrollmentText.split(",");
        this.group.professor = JSON.parse(sessionStorage.getItem('userJson')).id;
        if (llenado) {
            console.log(this.group);
            this.groupsService.createGroup(this.group).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.renderTable();
                    this.group = {courseId: "", enrollmentText: "", period: ""};
                }
            });
        }
    }

    onDeleteGroup(group) {
        var r = confirm("Are you sure?");
        if (r == true) {
            console.log(group);
            this.groupsService.deleteGroup(group).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.renderTable();
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
                    this.renderTable();
                    this.user = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
                }
            });
        }
    }

    onDeleteUser(user) {
        var r = confirm("Are you sure?");
        if (r == true) {
            console.log(user);
            this.usersService.deleteUser(user).subscribe((result) => {
                if (!result) {
                    console.log("Fallo");
                }
                else {
                    console.log(result);
                    this.renderTable();
                }
            });
        }
    }

    onSelectUser(user) {
        this.router.navigate(['/editUser', user.id]);
    }

}
