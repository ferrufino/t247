import { Component, Output, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'admin',
    templateUrl: './admin-home.component.html',
    styleUrls: ['../../../styles/general-styles.css', './admin-home.component.css']
})

export class AdminHomeComponent implements OnInit {

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
