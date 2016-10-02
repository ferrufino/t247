import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterArrayOfObjects'
})
export class FilterArrayOfObjectsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
          return value.filter(item => {
              let keys = [];
              for (let key in value) {
                 if (value[key].match('^.*' + args +'.*$')) {
                     keys.push({key: key, value:value[key]});
                 }
              }
              return keys;
          });
      }
  }

}
