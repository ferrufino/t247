import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortAssignment'
})
export class SortAssignmentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });
  }

}
