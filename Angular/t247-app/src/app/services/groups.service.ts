import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";

@Injectable()
export class GroupsService {

    constructor(private http:Http) {
    }

    getGroups() {
        const serviceURL:string = 'http://107.170.255.106:5000/api/groups/';
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }
}
