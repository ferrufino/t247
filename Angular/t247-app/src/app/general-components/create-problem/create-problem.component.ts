/**
 * Created by Alfredo Hinojosa on 9/22/2016.
 */

import {Component} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";

import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";

@Component({
  selector: 'create-problem',
  providers: [SupportedLanguages, ProblemDifficulties],
  templateUrl: './create-problem.component.html'
})

export class CreateProblem {

  createProblemForm: FormGroup;
  supportedLanguages: ProgLanguage[];
  difficulties: string[]

  // This variable specifies the form type that will be displayed, in order to upload the problem
  // 0 = default value, 1 = full problem, 2 = function
  problemTypeFlag: number = 0;


  constructor(private _supportedLanguages: SupportedLanguages,
              private _problemDifficulties: ProblemDifficulties,
              private _formBuilder: FormBuilder) {
  }


  ngOnInit() {
    this.supportedLanguages = this._supportedLanguages.getLanguages();
    this.difficulties = this._problemDifficulties.getDifficulties();

    // Create the problem form object
    this.createProblemForm = this._formBuilder.group({
      'problemDetails': this._formBuilder.group({
        'problemName' : [ '', Validators.required ],
        'engDescription' : [ '', Validators.required],
        'spnDescription' : [ '', Validators.required],
        'memoryLimit' : [ '', Validators.required],
        'timeLimit' : [ '', Validators.required],
      })
    });
  }

  onSubmit(){
    console.log(this.createProblemForm);
  }

}
