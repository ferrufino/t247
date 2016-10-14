import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topics-dashboard',
  templateUrl: './topics-dashboard.component.html',
  styleUrls: ['./topics-dashboard.component.css']
})
export class TopicsDashboardComponent implements OnInit {

  topics: Array<string>;

  constructor() { }

  ngOnInit() {
    this.renderTopicCells();
  }

  renderTopicCells() {
    this.topics = ["System of linear equations", "Arithmetic Expressions", "Backtracking", "Binary Search Tree",
      "Classes", "Data Structure", "Decisions Structures", "Divide and Conquer", "Dynammic Programming",
      "Functions or methods", "Geometry", "Graph", "Greedy Algorithms", "Hashing", "Linked List", "Repetitions Stuctures",
      "STL", "Sorts", "Stacks", "Strings"];
  }
}
