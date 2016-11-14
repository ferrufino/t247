import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import 'codemirror/mode/javascript/javascript';


@Component({
  selector: 'code-editor',
  styleUrls: ['./editor.component.css'],
  template: `
  <div class="code-editor">
    <codemirror [(ngModel)]="code" [config]="codeMirrorConfig"></codemirror>
  </div>`,
})
export class EditorComponent implements OnInit {

  @Input() setSourceCode : string;

  private code: string; // The current value of the Code Mirror editor
  private codeMirrorConfig : any;

  // A basic template to fill the code editor
  private sampleCode: string = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a - b;
    return 0;
}`;


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
   * Returns the current code inside the editor
   * @returns {string}
   */
  getSourceCode() : string{
    return this.code;
  }

  setNewSourceCode(code : string) : void{
    this.code = code;
  }

}
