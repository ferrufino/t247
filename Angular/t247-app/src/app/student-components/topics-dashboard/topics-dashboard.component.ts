import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../../services/topics.service';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import {environment} from "../../../environments/environment";
import {ProblemsService} from '../../services/problems.service';

@Component({
  selector: 'app-topics-dashboard',
  templateUrl: './topics-dashboard.component.html',
  styleUrls: ['./topics-dashboard.component.css']
})
export class TopicsDashboardComponent implements OnInit {

  content: any[] = [];
  contentTable: any[] = [];
  private problemsBool;
  private selectedTopicName;
  private selectedTopicId;
  columns:Array<string>;

  constructor(private topicsService: TopicsService, private problemsService: ProblemsService, private _cacheService: CacheService) {
  }

  ngOnInit() {
    this.renderTopicCells();
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
    this.selectedTopicId = topic.id;
    this.selectedTopicName = "Problems for: " + topic.name;
    this.problemsBool = true;
  }

  showTopics() {
    this.problemsBool = false;
    this.selectedTopicName = "";
  }
}
