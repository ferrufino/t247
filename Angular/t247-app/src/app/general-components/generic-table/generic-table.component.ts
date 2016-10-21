import {Component, OnInit, Input} from '@angular/core';
import {JsonPipe} from '@angular/common';
import { Response } from "@angular/http";
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service.ts';
import { TopicsService } from '../../services/topics.service.ts';
import {GroupsService} from "../../services/groups.service";

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
    private router: Router) {
  }

  @Input('typetable') typeOfTableName: string;
  //typeOfTableName: string = "courses";
  columns: Array<string>;
  private problemsBool;
  private assignmentsBool;
  private submissionsBool;
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

      case "groups":
        this.groupsService.getGroups().subscribe(
          groups => {
            const myArray = [];
            for (let key in groups) {
              myArray.push(groups[key]);
              console.log(groups[key]);
            }
            this.content = myArray;
            this.groupsBool = true;
            this.columns = ["Id", "Name", "Period", "Edit", "Delete"];
          }
        );
        break;

      case "courses":
        this.coursesService.getCourses().subscribe(
          courses => {
            const myArray = [];
            for (let key in courses) {
              myArray.push(courses[key]);
              console.log(courses[key]);
            }
            this.content = myArray;
            this.coursesBool = true;
            this.columns = ["Id", "Title", "Edit", "Delete"];
          }
        );
        break;

        case "topics":
          this.topicsService.getTopics().subscribe(
            topics => {
              const myArray = [];
              for (let key in topics) {
                myArray.push(topics[key]);
                console.log(topics[key]);
              }
              this.content = myArray;
              this.topicsBool = true;
              this.columns = ["Id", "Title", "Edit", "Delete"];
            }
          );
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
