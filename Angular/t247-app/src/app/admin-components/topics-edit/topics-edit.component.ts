import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TopicsService } from '../../services/topics.service';

@Component({
  selector: 'topics-edit',
  templateUrl: './topics-edit.component.html',
  styleUrls: ['./topics-edit.component.css']
})
export class TopicsEditComponent implements OnInit{

    constructor(private topicsService : TopicsService) {}


    private topic;
    @Output() refresh = new EventEmitter();

    ngOnInit () {
    }

    ngAfterViewInit() {
    }

    setTopic(topicId) {
      this.topicsService.getTopic(topicId)
        .subscribe(topic => {
          this.topic = topic;
        });
    }

    onSubmit() {
      var llenado = true;
      if(this.topic.name===""){
        window.alert("Please type a topic name");
        llenado=false;
      }
      console.log(this.topic);
      if(llenado){
        this.topicsService.editTopic(this.topic).subscribe((result) => {
          if (!result) {
            console.log("Fallo");
          }
          else{
            console.log(result);
            this.refresh.emit();
          }
        });
      }
    }

}
