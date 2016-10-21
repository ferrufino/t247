import { Injectable } from '@angular/core';

// TODO: DEPRECATED DELETE THIS SERVICE

export class ProgLanguage {
    constructor(
        public name: string,
        public value: string,
        public extension: string) { }
}

var languges: ProgLanguage[] = [
    new ProgLanguage('C++','cpp', '.cpp'),
    new ProgLanguage('Java','java', '.java')
];

@Injectable()
export class SupportedLanguages {

    getLanguages(){
        return languges;
    }

}
