import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      return value.sort((a, b) => {
          if (a.id > b.id ) {
              return 1;
          }
          if (a.id < b.id ) {
              return -1;
          }
          return 0;
      });
  }

}
