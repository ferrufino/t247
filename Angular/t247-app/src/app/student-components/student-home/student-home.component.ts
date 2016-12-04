import { Component, Output, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'student',
    templateUrl: './student-home.component.html',
    styleUrls: ['../../../styles/general-styles.css', './student-home.component.css']
})

export class StudentHomeComponent implements OnInit {

    @Output() selectedTab : string;
    @Output() selectedTopic : string;
    isStudent : boolean;

    constructor(private _route : ActivatedRoute) {

    }

    ngOnInit() {
        this.isStudent = (JSON.parse(localStorage['userJson'])['role'] == 'student');
        console.log("isSTudent: " + this.isStudent);

        this._route.params.subscribe(event => {
            // Get tab parameter
            let tab = event['tab'];

            console.log("tab nueva: " + tab);

            if (tab == "topicsdashboard") {
                this.selectedTopic = event['topic'];
                //alert("topic: " + event['topic']);
            }
            
            this.selectedTab = tab;
        });
    }

}
