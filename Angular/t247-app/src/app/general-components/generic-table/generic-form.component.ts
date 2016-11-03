import { Component } from '@angular/core';

@Component({
  selector: 'generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent {

  onSelectGroup(group) {
    this.router.navigate(['/groups', group.id]);
  }

  onSelectTopic(topic) {
    this.router.navigate(['/editTopic', topic.id]);
  }

  onDeleteTopic(topic) {
    var r = confirm("Are you sure?");
    if (r == true) {
      console.log(topic);
      this.topicsService.deleteTopic(topic).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
        }
      });
    }
  }

  onSubmitTopic() {
    var llenado = true;
    if (this.topicName === "") {
      window.alert("Please type a topic name");
      llenado = false;
    }
    console.log(this.topicName);
    if (llenado) {
      this.topicsService.createTopic(this.topicName).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
          this.topicName = '';
        }
      });
    }
  }

  onSelectCourse(course) {
    this.router.navigate(['/editCourse', course.id]);
  }

  onDeleteCourse(course) {
    var r = confirm("Are you sure?");
    if (r == true) {
      console.log(course);
      this.coursesService.deleteCourse(course).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
        }
      });
    }
  }

  onSubmitCourse() {
    var llenado = true;
    if (this.courseName === "") {
      window.alert("Please type a course name");
      llenado = false;
    }
    console.log(this.courseName);
    if (llenado) {
      this.coursesService.createCourse(this.courseName).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
          this.courseName = '';
        }
      });
    }
  }

  onDeleteGroup(group) {
    var r = confirm("Are you sure?");
    if (r == true) {
      console.log(group);
      this.groupsService.deleteGroup(group).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
        }
      });
    }
  }

  onSubmitUser() {
    var llenado = true;
    if (this.user.enrollment === "") {
      window.alert("Missing the enrollment");
      llenado = false;
    }
    if (this.user.first_name === "") {
      window.alert("Missing first name");
      llenado = false;
    }
    if (this.user.last_name === "") {
      window.alert("Missing last name");
      llenado = false;
    }
    if (this.user.role === "") {
      window.alert("Please choose a role");
      llenado = false;
    }
    if (this.user.email === "") {
      window.alert("Missing email");
      llenado = false;
    }
    if (this.user.password === "") {
      window.alert("Missing password");
      llenado = false;
    }
    if (llenado) {
      console.log(this.user);
      this.usersService.createUser(this.user).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
          this.user = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
        }
      });
    }
  }

  onDeleteUser(user) {
    var r = confirm("Are you sure?");
    if (r == true) {
      console.log(user);
      this.usersService.deleteUser(user).subscribe((result) => {
        if (!result) {
          console.log("Fallo");
        }
        else {
          console.log(result);
          this.renderTable();
        }
      });
    }
  }

  onSelectUser(user) {
    this.router.navigate(['/editUser', user.id]);
  }


}
