 import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

    transform(items: any[], args:string, preserveFormat:boolean): any {

        let ans = [];
        for (let k in items){
            if((items[k].enrollment?items[k].enrollment.match('^.*' + args +'.*$'):null)
                || (items[k].first_name?items[k].first_name.match('^.*' + args +'.*$'):null)
                || (items[k].last_name?items[k].last_name.match('^.*' + args +'.*$'):null)
                || (items[k].role?items[k].role.match('^.*' + args +'.*$'):null)) {
                if (preserveFormat == true)
                  ans.push(items[k]);
                else
                  ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }
}
