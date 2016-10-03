import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAssignments'
})
export class FilterAssignmentsPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].title.match('^.*' + args +'.*$')
                || items[k].class.match('^.*' + args +'.*$')
                || items[k].topic.match('^.*' + args +'.*$')
                || items[k].duedate.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }

}
