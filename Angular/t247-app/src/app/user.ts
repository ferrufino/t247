export class User {
    constructor(
        public email?:string,
        public id?:number,
        public first_name?:string,
        public last_name?:string,
        public enrollment?:string,
        public role?: [string],
        public password?:string) { }
}
