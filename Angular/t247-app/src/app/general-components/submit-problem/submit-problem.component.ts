import { Component, OnInit } from '@angular/core';
import {IMultiSelectOption,  IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

@Component({
  selector: 'submit-problem',
  templateUrl: './submit-problem.component.html',
  styleUrls: ['./submit-problem.component.css']
})
export class SubmitProblem {
    private selectedOptions: number[];
    private myOptions: IMultiSelectOption[] = [
        { id: 1, name: 'C++' },
        { id: 2, name: 'Java' },
    ];

    private mySettings: IMultiSelectSettings = {

        selectionLimit: 1,
        closeOnSelect: true,
        checkedStyle: 'checkboxes'
    }
    private myTexts: IMultiSelectTexts = {
        checked: 'checked',
        defaultTitle: 'Programming Languages'
    };

    onChange($event){
       // alert($event);
    }

}
