/**
 * Created by Alfredo Hinojosa on 9/22/2016.
 */

import { Injectable } from '@angular/core';

export class ProgLanguage {
    constructor(
        public name: string,
        public version: string) { }
}

var languges: ProgLanguage[] = [
    new ProgLanguage('C++','C++14'),
    new ProgLanguage('Java','Java 8')
];

@Injectable()
export class SupportedLanguages {

    getLanguages(){
        return languges;
    }

}
