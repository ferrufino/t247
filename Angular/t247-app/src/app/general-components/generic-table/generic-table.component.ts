import { Component, OnInit, Input } from '@angular/core';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit{

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

    private content;

    ngOnInit () {

        this.renderTable();
    }
    ngAfterViewInit() {


    }



    renderTable(){
        this.problemsBool = false;
        this.assignmentsBool = false;
        this.submissionsBool = false;
        this.groupsBool = false;
        this.coursesBool = false;
        this.topicsBool = false;
        this.usersBool = false;

       switch(this.typeOfTableName){

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
               this.groupsBool = true;
               this.columns = ["Name", "Period", "Edit", "Delete"];
               this.content = [
                   {
                       "name": "groupDummy1",
                       "period": "Aug 2016"

                   },
                   {
                       "name": "groupDummy2",
                       "period": "Aug 2016"

                   },
                   {
                       "name": "groupDummy3",
                       "period": "Aug 2016"

                   }
               ];
               break;

           case "courses":
               this.coursesBool = true;
               this.columns = ["Title", "Edit", "Delete"];
               this.content = [
                   {
                       "title": "Alg"
                   },
                   {
                       "title": "Data Structure"
                   },
                   {
                       "title": "Functional Programming"
                   }
               ];
               break;

           case "topics":
               this.topicsBool = true;
               this.columns = ["Title", "Edit", "Delete"];
               this.content = [
                   {
                       "title": "dynamic programming"
                   },
                   {
                       "title": "greedy alg"
                   },
                   {
                       "title": "graphs"
                   }
               ];
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


}
