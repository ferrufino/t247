import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../../services/topics.service';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-topics-dashboard',
  templateUrl: './topics-dashboard.component.html',
  styleUrls: ['./topics-dashboard.component.css']
})
export class TopicsDashboardComponent implements OnInit {

  content: any[] = [];

  constructor(private topicsService: TopicsService, private _cacheService: CacheService) {
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
          console.log("Se hizo get de topics");
        }
      );
    }
    console.log("bofos2");
    this.content = this._cacheService.get('topics');
  }
}
