import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].enrollmentId.match('^.*' + args +'.*$')
                || items[k].firstName.match('^.*' + args +'.*$')
                || items[k].lastName.match('^.*' + args +'.*$')
                || items[k].typeOfUser.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }
}