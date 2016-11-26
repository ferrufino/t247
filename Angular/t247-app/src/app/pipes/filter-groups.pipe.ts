import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGroups'
})
export class FilterGroupsPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if( (items[k].period?items[k].period.match('^.*' + args +'.*$'):null)
                || (items[k].course.name?items[k].course.name.match('^.*' + args +'.*$'):null) ) {
                ans.push({key: k, value: items[k]});
            }
        }

        //items[k].name.match('^.*' + args +'.*$')
    //||
        return ans;
    }
}
