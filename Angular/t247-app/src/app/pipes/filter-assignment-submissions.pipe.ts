import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAssignmentSubmissions'
})
export class FilterAssignmentSubmissionsPipe implements PipeTransform {

  transform(items: any[], args:string): any {

    let ans = [];
    for (let k in items){
      if((items[k].enrollment?items[k].enrollment.match('^.*' + args +'.*$'):null)
        || (items[k].student_name?items[k].student_name.match('^.*' + args +'.*$'):null)) {
        ans.push({key: k, value: items[k]});
      }
    }
    return ans;
  }

}
