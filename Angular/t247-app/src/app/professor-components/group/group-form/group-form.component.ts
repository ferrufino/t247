import {Component, OnInit, Input} from '@angular/core';
import {GroupsService} from '../../../services/groups.service';
import {UsersService} from '../../../services/users.service';
import {CacheService, CacheStoragesEnum} from 'ng2-cache/ng2-cache';
import {CoursesService} from '../../../services/courses.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'group-form',
    templateUrl: 'group-form.component.html',
    styleUrls: ['group-form.component.css']
})
export class GroupFormComponent implements OnInit {

    public courses;
    public formTitle;
    public submitText;

    @Input() group;
    @Input() action;

    constructor(private _service:GroupsService,
                private _authService:UsersService,
                private coursesService:CoursesService,
                private _cacheService:CacheService) {

    }

    ngOnInit() {
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
        this._authService.checkCredentials();
        if (this.action == "create") {
            this.submitText = "Create Group";
            this.formTitle = "New Group";
        } else {
            this.submitText = "Update Group";
            this.formTitle = "Edit Group";
        }
    }

    onSubmit() {
        var llenado = true;
        this.group.courseId = this.group.course.id;
        if (this.group.courseId === "") {
            window.alert("Favor de escoger un curso");
            llenado = false;
        }
        if (this.group.enrollmentText === "") {
            window.alert("Favor de dar de alta estudiantes");
            llenado = false;
        }
        if (this.group.period === "") {
            window.alert("Favor de escribir un periodo");
            llenado = false;
        }
        this.group.courseId = Number(this.group.courseId);
        this.group.enrollmentText = this.group.enrollmentText.replace(/\s/g, '');
        debugger;
        this.group.enrollments = this.group.enrollmentText.split(",");
        this.group.professor = JSON.parse(localStorage.getItem('userJson')).id;
        if (llenado) {
            if (this.action == "create") {
                console.log(this.group);
                this._service.createGroup(this.group).subscribe((result) => {
                    if (!result) {
                        console.log("Fallo");
                    }
                    else {
                        console.log(result);
                        //this.renderTable();
                        this.group = {courseId: "", enrollmentText: "", period: ""};
                    }
                });
            } else {
                console.log(this.group);
                this._service.editGroup(this.group).subscribe((result) => {
                    if (!result) {
                        console.log("Fallo");
                    }
                    else {
                        console.log(result);
                    }
                });
            }
        }
    }

}
