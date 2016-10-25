import { Component } from '@angular/core';
import 'codemirror/mode/javascript/javascript';


var sampleCode = `// Write or Paste your code here...
if(youReallyThinkYouCanCode){
    cout<<"I got this";
}
`;

@Component({
    selector: 'code-editor',
    template: `<div>
    <codemirror [(ngModel)]="code" [config]="config"></codemirror>
  </div>`,
})
export class EditorComponent {

        // Configuration object
        config = {
            lineNumbers: true,
            mode: {
                name: 'javascript',
                json: true
            }
        };

        // Sample code
        code = sampleCode;

}