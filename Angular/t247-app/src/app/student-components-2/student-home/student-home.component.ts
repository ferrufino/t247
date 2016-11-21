import { Component, Output, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'student',
    templateUrl: './student-home.component.html',
    styleUrls: ['../../../styles/general-styles.css', './student-home.component.css']
})

export class StudentHomeComponent implements OnInit {

    @Output() selectedTab : string;

    constructor(private _route : ActivatedRoute) {

    }

    ngOnInit() {
        this._route.params.subscribe(event => {
            // Get tab parameter
            let tab = event['tab'];

            console.log("tab nueva: " + tab);
            
            this.selectedTab = tab;
        });
    }

}
