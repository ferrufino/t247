import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if((items[k].enrollmentId?items[k].enrollmentId.match('^.*' + args +'.*$'):null)
                || (items[k].firstName?items[k].firstName.match('^.*' + args +'.*$'):null)
                || (items[k].lastName?items[k].lastName.match('^.*' + args +'.*$'):null)
                || (items[k].typeOfUser?items[k].typeOfUser.match('^.*' + args +'.*$'):null)) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }
}