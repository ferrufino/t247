import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].enrollment.match('^.*' + args +'.*$')
                || items[k].first_name.match('^.*' + args +'.*$')
                || items[k].last_name.match('^.*' + args +'.*$')
                || items[k].role.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }
}
