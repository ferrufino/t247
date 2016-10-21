import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../../services/topics.service';

@Component({
  selector: 'app-topics-dashboard',
  templateUrl: './topics-dashboard.component.html',
  styleUrls: ['./topics-dashboard.component.css']
})
export class TopicsDashboardComponent implements OnInit {

  content: any[] = [];

  constructor(private topicsService: TopicsService) {
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
        this.content = myArray;
      }
    );
  }
}
