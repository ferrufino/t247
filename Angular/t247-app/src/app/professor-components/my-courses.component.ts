/**
 * Created by ikerarb on 18/09/16.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'my-courses',
  template: `
  <table class="bordered centered">
      <thead>
        <tr>
            <th data-field="id">#</th>
            <th data-field="course">Course</th>
            <th data-field="group">Group</th>
            <th data-field="period">Period</th>
            <th data-field="details"></th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>1</td>
          <td>Data Structures</td>
          <td>Mon-Thu 16:30</td>
          <td>Aug-Dec 2016</td>
          <td>
            <a class="waves-effect waves-light btn">Details</a>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Data Structures</td>
          <td>Mon-Thu 16:30</td>
          <td>Aug-Dec 2016</td>
          <td>
            <a class="waves-effect waves-light btn">Details</a>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>Data Structures</td>
          <td>Mon-Thu 16:30</td>
          <td>Aug-Dec 2016</td>
          <td>
            <a class="waves-effect waves-light btn">Details</a>
          </td>
        </tr>
      </tbody>
    </table>
                      `
})

export class MyCourses {

}
