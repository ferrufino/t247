import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTopics'
})
export class FilterTopicsPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if(items[k].title.match('^.*' + args +'.*$')) {
                ans.push({key: k, value: items[k]});
            }
        }
        return ans;
    }

}
