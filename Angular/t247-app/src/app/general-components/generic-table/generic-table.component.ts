import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent {

    myvalues = ['Milk', 'Bread', 'Gustavo', 'Ferrufino', 'Mom', 'ea', 'earing'];

   content = [
       {
           "createdAt": 1456399292790,
           "isActive": true,
           "id": "Hero 1"
       },
       {
           "createdAt": 1456399371220,
           "isActive": false,
           "id": "Hero 2"
       },
       {
           "createdAt": 1456399374548,
           "isActive": true,
           "id": "Hero 3"
       }
   ];
}
