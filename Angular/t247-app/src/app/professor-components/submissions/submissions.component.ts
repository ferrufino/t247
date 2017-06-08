import {Component, OnInit, OnChanges, ElementRef} from '@angular/core';
import {ActivatedRoute, Params}   from '@angular/router';
import {AssignmentsService} from '../../services/assignments.service';
import { HighlightJsService } from 'angular2-highlight-js';

@Component({
    selector: 'submissions-of-assig',
    templateUrl: './submissions.component.html',
    styleUrls: ['./submissions.component.css']
})
export class SubmissionsOfAssignmentComponent implements OnInit, OnChanges {

    private assignmentId;
    private studentId;
    codeToShow: any;
    table:any[] = [];
    constructor(private route:ActivatedRoute,
                private assignmentsService:AssignmentsService,
                private highlightService : HighlightJsService,
                private el: ElementRef) {
    }
    ngOnChanges(){

    }

    ngOnInit() {
        this.route.params.forEach((params:Params) => {
            this.assignmentId = +params['assig_id'];
            this.studentId = +params['student_id'];
            this.assignmentsService.getSubmissionsOfAssignment( this.assignmentId, this.studentId).subscribe(
                submissions => {

                    this.table = submissions;
                    console.log(this.table);
                }
            );
        });

    }
    loadModal(code){

        // Manually inserting code in modal so that it is properly displayed (http://stackoverflow.com/questions/40693556/using-highlight-js-in-angular-2)
        var codeElement = this.el.nativeElement.querySelector('.code-attempt');

        // Insert dummy appropriate content so that real content will be appropriately displayed/highlighted
        // (even if real content is malformed)
        codeElement.textContent = "int function(string a, string b) { return a[8]; }";

        // Insert real content
        this.codeToShow = code;
        codeElement.textContent = code;
        this.highlightService.highlight(codeElement);

    }
}
