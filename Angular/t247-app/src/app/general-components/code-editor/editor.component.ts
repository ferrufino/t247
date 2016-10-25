import {Component, Output, EventEmitter} from '@angular/core';
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
    <button type="button" class="btn btn-success" (click)='onClick()'>Submit</button>
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

    @Output() codeToSubmit = new EventEmitter();

    onClick() {
        this.codeToSubmit.emit(this.code);
    }

}