import { Component, OnInit, Input } from '@angular/core';
import { AssignmentsService } from '../../services/assignments.service.ts';

@Component({
  selector: 'assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  private _isOpen:boolean = false;

  @Input() assignment;

  constructor(private assignmentsService: AssignmentsService) {

  }

  ngOnInit() {
  }

  get isOpen() {
    return this._isOpen;
  }

  toggleOpen(event: MouseEvent): void {
    event.preventDefault();
    this._isOpen = !this.isOpen;
  }

}
