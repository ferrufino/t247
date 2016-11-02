import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { AssignmentsService } from '../../../services/assignments.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'assignment-form',
  templateUrl: 'assignment-form.component.html',
  styleUrls: ['assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {

  private assignmentForm : FormGroup;

  @Input() groupId;

  constructor(private _service: AssignmentsService,
              private _formBuilder: FormBuilder,
              private _authService: UsersService) {

  }

  ngOnInit() {
    this.assignmentForm = this._formBuilder.group({
      'assignment': this._formBuilder.group({
        'startDate': ['', Validators.required],
        'dueDate': ['', Validators.required],
        'title': ['', Validators.required],
        'groupId': [this.groupId, Validators.required],
        'problemId': ['', Validators.required]
      })
    });
    this._authService.checkCredentials();
  }

  onSubmit() {
    let request = {
      "start_date": this.assignmentForm.value.assignment.startDate,
      "due_date": this.assignmentForm.value.assignment.dueDate,
      "title": this.assignmentForm.value.assignment.title,
      "group_id": this.assignmentForm.value.assignment.groupId,
      "problem_id": this.assignmentForm.value.assignment.problemId
    };

    this._service.createAssignment(request)
      .subscribe(
        data => {
          // Check for server errors
          console.log(data);

        }
      );

  }
}
