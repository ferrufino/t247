**#Keys Pipe**

_Used for converting a Json into a readable array of objects_
_#Example of use:_

### Definition in typescript
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
### Definition in html for loading elements
 <span *ngFor="let entry of content | keys">
 Key: {{entry.key}}, id: {{entry.value.id}}, Status: {{entry.value.isActive}}
 <br/>
 </span>