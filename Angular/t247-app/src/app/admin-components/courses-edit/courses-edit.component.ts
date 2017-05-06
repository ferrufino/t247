import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'courses-edit',
  templateUrl: './courses-edit.component.html',
  styleUrls: ['./courses-edit.component.css']
})
export class CoursesEditComponent implements OnInit {

    constructor(private coursesService : CoursesService) {}

    private course;
    @Output() refresh = new EventEmitter();

    ngOnInit () {
    }

    ngAfterViewInit() {
    }

    setCourse(courseId) {
      this.coursesService.getCourse(courseId)
        .subscribe(course => {
          console.log(course);
          this.course = course;
        });
    }

    onSubmit() {
      var llenado = true;
      if(this.course.name===""){
        window.alert("Please type a course name");
        llenado=false;
      }
      console.log(this.course);
      if(llenado){
        this.coursesService.editCourse(this.course).subscribe((result) => {
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
