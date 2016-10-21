import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCourses'
})
export class FilterCoursesPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].name.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }

}
