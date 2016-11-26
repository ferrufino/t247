import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { AssignmentsService } from '../../../services/assignments.service';
import { UsersService } from '../../../services/users.service';
import { ProblemsService } from "../../../services/problems.service";

@Component({
  selector: 'assignment-form',
  templateUrl: 'assignment-form.component.html',
  styleUrls: ['assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {

  private assignmentForm : FormGroup;
  private problems;
  private start_value;
  private due_value;
  private submitText = 'Create Assignment';
  private formTitle = 'New Assignment';

  @Input() groupId;
  @Input() action;
  @Output() refreshParent = new EventEmitter();

  constructor(private _service: AssignmentsService,
              private _formBuilder: FormBuilder,
              private _authService: UsersService,
              private _problemsService : ProblemsService) {
  }

  ngOnInit() {
    this._authService.checkCredentials();
    this._problemsService.getProblems().subscribe(
      problems => {
        console.log(problems);
        this.problems = problems;

      },
      error => {
        console.log("An error ocurred while retrieving the problems");
      }
    );
    this.assignmentForm = this._formBuilder.group({
      'assignment': this._formBuilder.group({
        'id': '',
        'startDate': ['', Validators.required],
        'dueDate': ['', Validators.required],
        'title': ['', Validators.required],
        'groupId': [this.groupId, Validators.required],
        'problemId': ['', Validators.required]
      })
    });
  }

  setAssignment(assignment) {
    let start_date = new DatePipe('en-US').transform(assignment.start_date, 'yyyy-MM-dd');
    let due_date = new DatePipe('en-US').transform(assignment.due_date, 'yyyy-MM-dd');
    this.action = 'edit';
    this.formTitle = 'Edit Assignment';
    this.submitText = 'Update Assignment';
    this.assignmentForm.setValue({assignment: {
      id: assignment.id,
      startDate: start_date,
      dueDate: due_date,
      title: assignment.title,
      groupId: assignment.group_id,
      problemId: assignment.problem.id
      },
    });
  }

  onSubmit() {
    let startDate = this.fixDate(this.assignmentForm.value.assignment.startDate);
    let dueDate =  this.fixDate(this.assignmentForm.value.assignment.dueDate);
    debugger;
    let request = {
      "start_date": startDate,
      "due_date": dueDate,
      "title": this.assignmentForm.value.assignment.title,
      "group_id": this.assignmentForm.value.assignment.groupId,
      "problem_id": this.assignmentForm.value.assignment.problemId
    };
    if (this.action == 'new') {
      this._service.createAssignment(request)
        .subscribe(
          data => {
            // Check for server errors
            console.log(data);
            this.refreshParent.emit();
            this.assignmentForm.reset();
          }
        );
    } else {
      request['id'] = this.assignmentForm.value.assignment.id;
      this._service.editAssignment(request)
        .subscribe(
          data => {
            // Check for server errors
            console.log(data);
            this.refreshParent.emit();
            this.assignmentForm.reset();
          }
        );
    }
  }

  clear() {
    this.assignmentForm.reset();
  }

  fixDate(s_date) {
    let date = new Date(s_date);
    let milliseconds = date.getTimezoneOffset()*60*1000;
    date.setTime(date.getTime() + milliseconds);
    return date.toISOString();
  }
}
