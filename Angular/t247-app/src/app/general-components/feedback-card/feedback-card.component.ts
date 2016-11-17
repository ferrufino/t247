import {Component, OnInit, EventEmitter} from '@angular/core';

@Component({
    selector: 'feedback-card',
    templateUrl: './feedback-card.component.html',
    styleUrls: ['./feedback-card.component.css']
})
export class FeedbackCardComponent implements OnInit {

    private content:string;

    constructor() {
    }

    ngOnInit() {
        document.getElementById('success-feedback').style.display = "none";
        document.getElementById('error-feedback').style.display = "none";
    }

    fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = (op).toString();
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1; // control how it disappears
        }, 50); // time showed
    }

    hideFeedbackCard(type:string, message:string) {

        this.content = message;

        if (type == "success") {
            document.getElementById('success-feedback').style.display = "block";
            var element = document.getElementById('success-feedback');
        } else {
            document.getElementById('error-feedback').style.display = "block";
            var element = document.getElementById('error-feedback');
        }
        window.setTimeout(() =>{
            this.fade(element);
        }, 5000);
        element.style.opacity = "1";
        element.style.filter = 'alpha(opacity=1)';

    }
}
