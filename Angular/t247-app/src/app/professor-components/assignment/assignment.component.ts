import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  private _isOpen:boolean = true;

  @Input() assignment;

  constructor() {

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
