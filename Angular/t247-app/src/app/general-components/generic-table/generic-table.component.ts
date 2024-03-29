import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {Response} from "@angular/http";
import {Router} from '@angular/router';
import {CoursesService} from '../../services/courses.service.ts';
import {TopicsService} from '../../services/topics.service.ts';
import {GroupsService} from "../../services/groups.service";

import {AssignmentsService} from '../../services/assignments.service';
import {environment} from '../../../environments/environment';
import {UsersService} from '../../services/users.service';
import {SubmitProblemService} from '../../services/submit-problem.service';
import {ProblemsService} from '../../services/problems.service';

import {CacheStoragesEnum} from 'ng2-cache/src/enums/cache-storages.enum';
import {CacheService} from 'ng2-cache/src/services/cache.service';

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
    filterTag:string = "";
    group:any = {course: {id: "", name: ""}, enrollmentText: "", period: ""};
    typeOfUser:string;

    constructor(private topicsService:TopicsService,
                private coursesService:CoursesService,
                private groupsService:GroupsService,
                private assignmentsService:AssignmentsService,
                private router:Router,
                private _cacheService:CacheService,
                private usersService:UsersService,
                private submissionOfProblems:SubmitProblemService,
                private problemsService:ProblemsService) {
    }

    @Input('typetable') typeOfTableName:string;
    @Input('assignment') assignmentId:number;
    @Input('topicId') topicId:number;
    @Input('assignmentIDForSubmissionsOfAssignment') assgIdForSubmOfAssig: number;
    @Input('studentIDForSubmissionsOfAssignment') studentIdForSubmOfAssig: number;

    columns:Array<string>;
    private problemsBool;
    private problemsByTopicBool;
    private assignmentsBool;
    private submissionsBool;
    private assignmentSubmissionsBool;
    private groupsBool;
    private coursesBool;
    private topicsBool;
    private usersBool;
    private assignmentIdForAssignment;
    private studentIdForAssignment;

    content:any[] = [];

    @ViewChild('userModal') userModal;
    @ViewChild('topicModal') topicModal;
    @ViewChild('courseModal') courseModal;

    ngOnInit() {
        this.renderTable();
    }

    ngAfterViewInit() {


    }


    renderTable() {
        let userInfo = JSON.parse(localStorage.getItem("userJson"));
        this.typeOfUser = userInfo.role;
        switch (this.typeOfTableName) {

            case "problems":
                this.problemsService.getProblems().subscribe(
                    submissions => {
                        console.log("PROBLEMAS");
                        console.log(submissions);

                        this.content = submissions;
                        this.problemsBool = true;
                        this.assignmentsBool = false;
                        this.submissionsBool = false;
                        this.assignmentSubmissionsBool = false;
                        this.groupsBool = false;
                        this.coursesBool = false;
                        this.topicsBool = false;
                        this.usersBool = false;
                        this.problemsByTopicBool = false;
                        this.columns = ["Title", "Difficulty", "Topic", "Status", "Description", "Delete"];
                    }
                );
                break;

            case "problemsByTopic":
                let ID_topic = this.topicId;
                let userInformation = JSON.parse(localStorage.getItem("userJson"));
                this.problemsService.getProblemsFromTopic(ID_topic, userInformation.id).subscribe(
                    problems => {

                        this.content = problems;
                        this.problemsByTopicBool = true;
                        this.problemsBool = false;
                        this.assignmentsBool = false;
                        this.submissionsBool = false;
                        this.assignmentSubmissionsBool = false;
                        this.groupsBool = false;
                        this.coursesBool = false;
                        this.topicsBool = false;
                        this.usersBool = false;

                        this.columns = ["Title", "Difficulty", "Status", "Try it"];
                    }
                );
                break;

            case "assignments":

                this.assignmentsService.getAssignmentsByStudent(userInfo.id).subscribe(
                    submissions => {
                        this.assignmentsBool = true;
                        this.columns = ["Try it", "Name of Assignment", "Problem", "Class", "Difficulty", "Due Date", "Completed"];
                        this.content = submissions;
                    });
                break;

            case "submissions":
                this.submissionOfProblems.getSubmissions(userInfo.id).subscribe(
                    submissions => {

                        console.log("TODAS LAS SUBMISSIONS");
                        console.log(submissions);

                        this.submissionsBool = true;
                        this.problemsBool = false;
                        this.assignmentsBool = false;
                        this.assignmentSubmissionsBool = false;
                        this.groupsBool = false;
                        this.coursesBool = false;
                        this.topicsBool = false;
                        this.usersBool = false;
                        this.problemsByTopicBool = false;

                        this.columns = ["Name", "Number of Attempts", "Solved"];
                        this.content = submissions;
                    }
                );


                break;

            case "assignmentSubmissions":
                this.assignmentsService.getSubmissions(this.assignmentId).subscribe(
                    submissions => {
                        this.content = submissions;
                        this.assignmentIdForAssignment = this.assignmentId;
                        this.assignmentSubmissionsBool = true;
                        this.problemsBool = false;
                        this.assignmentsBool = false;
                        this.submissionsBool = false;
                        this.groupsBool = false;
                        this.coursesBool = false;
                        this.topicsBool = false;
                        this.usersBool = false;

                        this.columns = ["Student", "Enrollment", "Date of last submission", "Attempts", "Solved"];

                        this.problemsByTopicBool = false;
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
                            }
                            this._cacheService.set('courses', myArray, {maxAge: environment.lifeTimeCache});
                            this.courses = this._cacheService.get('courses');
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
                            }
                            this._cacheService.set('groups', myArray, {maxAge: environment.lifeTimeCache});
                            this.content = this._cacheService.get('groups');
                            //console.log("Se hizo get de groups");
                        }
                        else {
                            this.content = this._cacheService.get('groups');
                        }
                        this.groupsBool = true;
                        this.problemsBool = false;
                        this.assignmentsBool = false;
                        this.submissionsBool = false;
                        this.assignmentSubmissionsBool = false;
                        this.coursesBool = false;
                        this.topicsBool = false;
                        this.usersBool = false;
                        this.problemsByTopicBool = false;

                        this.columns = ["Name", "Period", "Show Assignments", "Delete"];
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
                            }
                            this._cacheService.set('courses', myArray, {maxAge: environment.lifeTimeCache});
                            this.content = this._cacheService.get('courses');
                            //console.log("Se hizo get de courses");
                        }
                        else {
                            this.content = this._cacheService.get('courses');
                        }
                        this.coursesBool = true;
                        this.problemsBool = false;
                        this.assignmentsBool = false;
                        this.submissionsBool = false;
                        this.assignmentSubmissionsBool = false;
                        this.groupsBool = false;
                        this.topicsBool = false;
                        this.usersBool = false;
                        this.problemsByTopicBool = false;

                        this.columns = ["Title", "Edit", "Delete"];
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
                this.problemsBool = false;
                this.assignmentsBool = false;
                this.submissionsBool = false;
                this.assignmentSubmissionsBool = false;
                this.groupsBool = false;
                this.coursesBool = false;
                this.usersBool = false;
                this.problemsByTopicBool = false;

                this.columns = ["Title", "Edit", "Delete"];
                break;

            case "users":
                this.usersBool = true;
                this.problemsBool = false;
                this.assignmentsBool = false;
                this.submissionsBool = false;
                this.assignmentSubmissionsBool = false;
                this.groupsBool = false;
                this.coursesBool = false;
                this.topicsBool = false;
                this.problemsByTopicBool = false;

                this.columns = ["Enrollment Id", "First Name", "Last Name", "Type Of User", "Edit", "Delete"];
                if (!this._cacheService.exists('users')) {
                    this.usersService.getUsers().subscribe(
                        users => {
                            const myArray = [];
                            for (let key in users) {
                                myArray.push(users[key]);
                            }
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
        this.router.navigate(['/professor/groups', group.id]);
    }

    onSelectTopic(topic) {
        this.topicModal.setTopic(topic.id);
    }

    onDeleteTopic(topic) {
        var r = confirm("Are you sure you want to delete this topic?");
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


    onSelectCourse(course) {
        this.courseModal.setCourse(course.id);
    }

    onDeleteCourse(course) {
        var r = confirm("Are you sure you want to delete this course? All associated groups will be deleted");
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


    onDeleteGroup(group) {
        var r = confirm("Are you sure you want to delete this group?");
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


    onDeleteUser(user) {
        var r = confirm("Are you sure you want to delete this user?");
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
        this.userModal.setUser(user.id);
    }

    onSelectAssignment(problem) {
        this.router.navigate(['student/submitProblem', problem.problem_id]);
    }

    onSelectProblem(problem) {
        this.router.navigate(['problem', problem.id]);
    }

    onDeleteProblem(problem) {
        var r = confirm("Are you sure you want to delete this problem? \n" +
            "All submissions and assignments related to this problem shall be deleted.");
        if (r == true) {
            this.problemsService.deleteProblem(problem.id).subscribe((result) => {
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

    createNewProblem() {
        this.router.navigate(['createProblem']);
    }

    toggleFilterTag(filterString) {
        if (this.filterTag == "" || this.filterTag != filterString) {
            this.filterTag = filterString;
        }
        else {
            this.filterTag = "";
        }
    }

    onChangeStatus(problem) {
        var newStatus;
        if (problem.active == true) {
            newStatus = 0;
        } else {
            newStatus = 1;
        }
        this.problemsService.changeStatusOfProblem(problem.id, newStatus).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            }
            else {
                console.log(result);
                this.renderTable();
            }
        });
    }

    showProblemSubmissionsOfStudent(student_id){
        this.studentIdForAssignment = student_id;
        this.renderTable();
        window.open('professor/student-attempts/' + this.assignmentIdForAssignment + '/' + student_id);
        //this.router.navigate(['professor/student-attempts/', this.assignmentIdForAssignment, student_id]);
    }

    zeroAttempts(){
        alert("No submissions were done.");
    }

}
