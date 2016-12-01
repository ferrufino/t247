import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TopicsService } from '../../services/topics.service';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import {environment} from "../../../environments/environment";
import {ProblemsService} from '../../services/problems.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-topics-dashboard',
  templateUrl: './topics-dashboard.component.html',
  styleUrls: ['./topics-dashboard.component.css']
})
export class TopicsDashboardComponent implements OnInit {

  content: any[] = [];
  contentTable: any[] = [];
  private problemsBool;
  @Input() selectedTopic : string;
  selectedTopicName : string;
  columns:Array<string>;

  constructor(private topicsService: TopicsService, private problemsService: ProblemsService, private _cacheService: CacheService, private _route : ActivatedRoute, private _router : Router) {
  }

  ngOnInit() {
    this.renderTopicCells();    
  }

  ngOnChanges(changes: SimpleChanges) {
    // On changes to selectedTopic
    if (this.selectedTopic != undefined) {
      this.topicsService.getTopic(+this.selectedTopic).subscribe(
        topic => {
          this.selectedTopicName = topic['name'];
        }
      );
    }
  }

  renderTopicCells() {

    if (!this._cacheService.exists('topics')) {
      this.topicsService.getTopics().subscribe(
        topics => {
          const myArray = [];
          for (let key in topics) {
            myArray.push(topics[key]);
          }
          this._cacheService.set('topics', myArray, {maxAge: environment.lifeTimeCache});
          this.content = this._cacheService.get('topics');
        }
      );
      console.log("observing order 3");
    } else {
      this.content = this._cacheService.get('topics');
    }
  }

  displayProblems(topic) {
    this._router.navigate(['student/tab/topicsdashboard/' + topic]); 
  }

}
