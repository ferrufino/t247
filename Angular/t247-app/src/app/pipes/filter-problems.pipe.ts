import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProblems'
})
export class FilterProblemsPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].title.match('^.*' + args +'.*$')
                || items[k].difficulty.match('^.*' + args +'.*$')
                || items[k].active.match('^.*' + args +'.*$')
                || items[k].changeStatus.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }

}
