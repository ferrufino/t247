import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
/*Pipe used to load jsons into Array Objects in Angular 2*/
export class KeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        let keys = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}
