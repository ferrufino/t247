import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortProblem'
})
export class SortProblemPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.sort((a, b) => {
        if (a.topic > b.topic) {
          return 1;
        }
        if (a.topic < b.topic) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
    });
  }

}
