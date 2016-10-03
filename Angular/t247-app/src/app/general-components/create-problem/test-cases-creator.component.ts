import { Component } from '@angular/core';

export class TestCase {

  public onDescription: boolean;
  public content: string;
  public output: string;
  public feedback: string;

  constructor(onDescription: boolean) {
    this.onDescription = onDescription;
  }
}

@Component({
  selector: 'app-test-cases-creator',
  templateUrl: './test-cases-creator.component.html'
})
export class TestCasesCreatorComponent {

  testcaseslist: TestCase[];

  constructor() {
    this.testcaseslist = [];
  }

  /**
   * This function creates a new TestCase object with the onDescription property equals to false,
   * after this function runs a new Materialize card is added to the DOM
   */
  addTestCase(){
    let temp = new TestCase(false);
    this.testcaseslist.push(temp);
  }

  /**
   * This function removes a TestCase from the Test Cases list.
   * This function is called from the delete button of a Materialize card
   * @param index the position of the TestCase that will be deleted from the list
   */
  deleteTestCase(index : number){
    this.testcaseslist.splice(index, 1);
  }

}
