import { Component } from '@angular/core';

@Component({
  selector: 'list-of-problems',
  template: `
  <table class="bordered centered">
      <thead>
        <tr>
            <th data-field="id">#</th>
            <th data-field="name">Name</th>
            <th data-field="course">Course</th>
            <th data-field="topic">Topic</th>
            <th data-field="completed">Completed</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>1</td>
          <td>
            <a href="#">Something</a>
          </td>
          <td>Data Structures</td>
          <td>Linked Lists</td>
          <td>
            <input type="checkbox" id="check1" />
            <label for="check1"></label>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>
            <a href="#">Something</a>
          </td>
          <td>Data Structures</td>
          <td>Linked Lists</td>
          <td>
            <input type="checkbox" id="check2" />
            <label for="check2"></label>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>
            <a href="#">Something</a>
          </td>
          <td>Data Structures</td>
          <td>Linked Lists</td>
          <td>
            <input type="checkbox" id="check3" />
            <label for="check3"></label>
          </td>
        </tr>
      </tbody>
    </table>
                      `
})

export class ListOfProblems {

}
