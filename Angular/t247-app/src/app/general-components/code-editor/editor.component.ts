import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import 'codemirror/mode/javascript/javascript';


@Component({
  selector: 'code-editor',
  styleUrls: ['./editor.component.css'],
  template: `
  <div class="code-editor">
    <codemirror [(ngModel)]="code" [config]="codeMirrorConfig"></codemirror>
    <button type="button" class="btn btn-success submit-code-btn" (click)='onClick()'>Submit</button>
  </div>`,
})
export class EditorComponent implements OnInit {

  @Input() setSourceCode : string;
  @Output() codeToSubmit = new EventEmitter();

  private code: string; // The current value of the Code Mirror editor
  private codeMirrorConfig : any;

  // A basic template to fill the code editor
  private sampleCode: string = `// Write or Paste your code here...
  if(youReallyThinkYouCanCode){
    cout<<"I got this";
  }
`;


  constructor() {
  }

  ngOnInit() {

    // Setup the Code Mirror object
    this.codeMirrorConfig = {
      lineNumbers: true,
      mode: {
        name: 'javascript',
        json: true
      }
    };


    // Get the correct initial value of the editor
    if(this.setSourceCode == null){
      this.code = this.sampleCode; // Set the initial value to the editor
    } else {
      this.code = this.setSourceCode;
    }

  }

  /**
   * This function is called when the submit button of the editor is clicked.
   * The current value of the editor is emited as output.
   */
  onClick() {
    this.codeToSubmit.emit(this.code);
  }

}
