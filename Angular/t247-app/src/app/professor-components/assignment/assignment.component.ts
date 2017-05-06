import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssignmentsService } from '../../services/assignments.service';

@Component({
  selector: 'assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  private _isOpen:boolean = false;

  @Input() assignment;
  @Output() deleted = new EventEmitter();
  @Output() edit = new EventEmitter<any>();

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

  onDelete() {
    this.assignmentsService.deleteAssignment(this.assignment.id).subscribe(
      data => {
        this.deleted.emit();
      }
    );
  }

  onEdit() {
    this.edit.emit(this.assignment);
  }

}
