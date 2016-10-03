import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGroups'
})
export class FilterGroupsPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].name.match('^.*' + args +'.*$')
                || items[k].period.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }
}
