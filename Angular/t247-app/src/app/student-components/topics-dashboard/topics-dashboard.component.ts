import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../../services/topics.service';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-topics-dashboard',
  templateUrl: './topics-dashboard.component.html',
  styleUrls: ['./topics-dashboard.component.css']
})
export class TopicsDashboardComponent implements OnInit {

  content: any[] = [];

  constructor(private cacheService: CacheService, private topicsService: TopicsService) {
  }

  ngOnInit() {
    this.renderTopicCells();
  }

  renderTopicCells() {
    this.topicsService.getTopics().subscribe(
      topics => {
        const myArray = [];
        for (let key in topics) {
          myArray.push(topics[key]);
        }
        this.cacheService.set('data', myArray);
        console.log(cacheService('data'));
        this.content = this.cacheService.get('data');
      }
    );
  }
}
