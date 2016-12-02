import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoursesService} from '../../services/courses.service.ts';
import {TopicsService} from '../../services/topics.service.ts';
import {UsersService} from '../../services/users.service';
import {GroupsService} from '../../services/groups.service';
import {CacheService, CacheStoragesEnum} from 'ng2-cache/ng2-cache';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'generic-form',
    templateUrl: "./generic-form.component.html",
    styleUrls: ["./generic-form.component.css"]
})
export class GenericFormComponent implements OnInit {
    finished:string = "";
    courses:Array<any>;
    user:any = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
    topicName:string = "";
    courseName:string = "";
    group:any = {course: {id: "", name: ""}, enrollmentText: "", period: ""};
    private form : FormGroup;

    @Input('typeForm') typeOfForm:string;
    @Output() formChange = new EventEmitter();

    constructor(private topicsService:TopicsService,
                private coursesService:CoursesService,
                private usersService:UsersService,
                private groupsService:GroupsService,
                private _cacheService:CacheService,
                private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        console.log(this.typeOfForm);
        this.coursesService.getCourses().subscribe(
            courses => {
                if (!this._cacheService.exists('courses')) {
                    const myArray = [];
                    for (let key in courses) {
                        myArray.push(courses[key]);
                        console.log(courses[key]);
                    }
                    this._cacheService.set('courses', myArray, {maxAge: environment.lifeTimeCache});
                    this.courses = this._cacheService.get('courses');
                    //console.log("Se hizo get de courses");
                }
                else {
                    this.courses = this._cacheService.get('courses');
                }
            }
        );
        switch (this.typeOfForm) {
          case 'users':
            this.form = this._formBuilder.group({
              'user': this._formBuilder.group({
                'enrollment': ['', Validators.required],
                'first_name': ['', Validators.required],
                'last_name': ['', Validators.required],
                'role': ['', Validators.required],
                'email': ['', Validators.required],
                'password': ['', Validators.required]
              })
            });
            break;
          case 'groups':
            this.form = this._formBuilder.group({
              'group': this._formBuilder.group({
                'course_id': ['', Validators.required],
                'enrollmentText': ['', Validators.required],
                'period': ['', Validators.required]
              })
            });
            break;
          case 'topics':
            this.form = this._formBuilder.group({
              'topic': this._formBuilder.group({
                'name': ['', Validators.required]
              })
            });
            break;
          case 'courses':
            this.form = this._formBuilder.group({
              'course': this._formBuilder.group({
                'name': ['', Validators.required]
              })
            });
            break;
          default:
            break;
        }
    }


    onSubmitCourse() {
        let request = {
            "name": this.form.value.course.name
        };
        console.log(request);
        this.coursesService.createCourse(request.name).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            } else {
                console.log(result);
                this.courseName = '';
                this.formChange.emit();
            }
        });
    }


    onSubmitUser(roleSelected) {
        let request = {
            "enrollment": this.form.value.user.enrollment,
            "first_name": this.form.value.user.first_name,
            "last_name": this.form.value.user.last_name,
            "role": this.form.value.user.role,
            "email": this.form.value.user.email,
            "password": this.form.value.user.password
        };
        this.usersService.createUser(request).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            }
            else {
                console.log(result);
                this.user = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
                this.formChange.emit();
            }
        });
    }

    onSubmitTopic() {
        let request = {
            "name": this.form.value.topic.name
        };
        console.log(request);
        this.topicsService.createTopic(request.name).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            } else {
                console.log(result);
                this.topicName = '';
                this.formChange.emit();
            }
        });
    }

    onSubmitGroup() {
        let enrollmentText = this.form.value.group.enrollmentText.replace(/\s/g, '');
        let enrollments = enrollmentText.split(",");
        let request = {
            "course_id": this.form.value.group.course_id,
            "enrollments": enrollments,
            "professor": JSON.parse(localStorage.getItem('userJson')).id,
            "period": this.form.value.group.period
        };
        console.log(request);
        this.groupsService.createGroup(request).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            } else {
                console.log(result);
                //this.renderTable();
                this.group = {course: {id: "", name: ""}, enrollmentText: "", period: ""};
                this.formChange.emit();
            }
        });
    }
}
