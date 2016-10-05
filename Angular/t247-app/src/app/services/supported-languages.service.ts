/**
 * Created by Alfredo Hinojosa on 9/22/2016.
 */

import { Injectable } from '@angular/core';

export class ProgLanguage {
    constructor(
        public name: string,
        public value: string) { }
}

var languges: ProgLanguage[] = [
    new ProgLanguage('C++','cpp'),
    new ProgLanguage('Java','java')
];

@Injectable()
export class SupportedLanguages {

    getLanguages(){
        return languges;
    }

}
