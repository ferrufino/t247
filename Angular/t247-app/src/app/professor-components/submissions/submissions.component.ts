import {Component, OnInit, OnChanges} from '@angular/core';
import {ActivatedRoute, Params}   from '@angular/router';
import {AssignmentsService} from '../../services/assignments.service';

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
    constructor(private route:ActivatedRoute, private assignmentsService:AssignmentsService) {
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

        this.codeToShow = code;
    }
}
