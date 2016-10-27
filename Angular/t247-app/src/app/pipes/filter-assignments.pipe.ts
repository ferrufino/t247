import { Pipe, PipeTransform } from '@angular/core';
import {NULL_EXPR} from "@angular/compiler/src/output/output_ast";

@Pipe({
  name: 'filterAssignments'
})
export class FilterAssignmentsPipe implements PipeTransform {

    transform(items: any[], args:string): any {

        let ans = [];
        for (let k in items){
            if((items[k].title? items[k].title.match('^.*' + args +'.*$'): null)

                || (items[k].class? items[k].class.match('^.*' + args +'.*$'): null)

                || (items[k].topic? items[k].topic.match('^.*' + args +'.*$') : null)

                || (items[k].duedate? items[k].duedate.match('^.*' + args +'.*$'): null)) {
                ans.push({key: k, value: items[k]});
            }


        }
        return ans;
    }

}
