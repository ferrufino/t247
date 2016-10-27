import {Component, OnInit, Input} from '@angular/core';
import {JsonPipe} from '@angular/common';
import { Response } from "@angular/http";
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service.ts';
import { TopicsService } from '../../services/topics.service.ts';
import {GroupsService} from "../../services/groups.service";
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import { AssignmentsService } from '../../services/assignments.service';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit {

  topicName:string;
  courseName:string;

  constructor(private topicsService:TopicsService,
              private coursesService: CoursesService,
              private groupsService: GroupsService,
              private assignmentsService: AssignmentsService,
              private router: Router,
              private _cacheService: CacheService) {
  }

  @Input('typetable') typeOfTableName: string;
  @Input('assignment') assignmentId: number;
  //typeOfTableName: string = "courses";
  columns: Array<string>;
  private problemsBool;
  private assignmentsBool;
  private submissionsBool;
  private assignmentSubmissionsBool;
  private groupsBool;
  private coursesBool;
  private topicsBool;
  private usersBool;

  content: any[] = [];

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
        this.problemsBool = true;
        this.columns = ["Title", "Difficulty", "Active", "Change Status", "Edit", "Delete"];
        this.content = [
          {
            "title": "dummyProblem 1",
            "difficulty": "easy",
            "active": true,
            "changeStatus": "deactivate?"
          },
          {
            "title": "dummyProblem 2",
            "difficulty": "hard",
            "active": true,
            "changeStatus": "deactivate?"
          },
          {
            "title": "dummyProblem 3",
            "difficulty": "hard",
            "active": false,
            "changeStatus": "deactivate?"
          }
        ];
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
        this.submissionsBool = true;
        this.columns = ["Name", "Number of Attempts", "Solved"];
        this.content = [
          {
            "name": "problem name",
            "numberOfAttempts": 5,
            "solved": true
          },
          {
            "name": "problem name",
            "numberOfAttempts": 12,
            "solved": false
          },
          {
            "name": "problem name",
            "numberOfAttempts": 2,
            "solved": true
          }
        ];
        break;

      case "assignmentSubmissions":
        this.assignmentsService.getSubmissions(this.assignmentId).subscribe(
          submissions => {
            debugger;
            this.content = submissions;
            this.assignmentSubmissionsBool = true;
            this.columns = ["Student", "Date of last submission", "Language", "Solved"];
          }
        );
        break;

      case "groups":
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
        this.content = [
          {
            "enrollmentId": "A1xxxxxx",
            "firstName": "Gustavo",
            "lastName": "Ferrufino",
            "typeOfUser": 'Admin'
          },
          {
            "enrollmentId": "A2xxxxxx",
            "firstName": "Eduardo",
            "lastName": "Zardain",
            "typeOfUser": 'Admin'
          },
          {
            "enrollmentId": "A0xxxxxx",
            "firstName": "Sergio",
            "lastName": "Fuentes",
            "typeOfUser": 'Admin'
          }
        ];

        break;

    }

  }

  onSelectGroup(group) {
    this.router.navigate(['/groups', group.id]);
  }

  onSelectTopic(topic) {
    this.router.navigate(['/editTopic', topic.id]);
  }

  onDeleteTopic(topic){
    var r = confirm("Are you sure?");
    if (r == true) {
      console.log(topic);
      this.topicsService.deleteTopic(topic).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else{
          console.log(result);
          this.renderTable();
        }
      });
    }
  }

  onSubmitTopic() {
    console.log(this.topicName);
    this.topicsService.createTopic(this.topicName).subscribe((result) => {
      if (!result) {
        console.log("Fallo");
      }
      else{
        console.log(result);
        this.renderTable();
      }
    });
  }

  onSelectCourse(course) {
    this.router.navigate(['/editCourse', course.id]);
  }

  onDeleteCourse(course){
    var r = confirm("Are you sure?");
    if (r == true) {
      console.log(course);
      this.coursesService.deleteCourse(course).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else{
          console.log(result);
          this.renderTable();
        }
      });
    }
  }

  onSubmitCourse() {
    console.log(this.courseName);
    this.coursesService.createCourse(this.courseName).subscribe((result) => {
      if (!result) {
        console.log("Fallo");
      }
      else{
        console.log(result);
        this.renderTable();
      }
    });
  }


}
