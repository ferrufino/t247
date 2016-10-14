/**
 * Created by Alfredo Hinojosa on 10/3/2016.
 */


/**
 * This class reflects all the information that a Test Case can have
 */

export class TestCase {

  public onDescription: boolean;
  public content: string;
  public output: string;
  public feedback: string;
  public status: string;

  constructor(onDescription: boolean, status: string) {
    this.onDescription = onDescription;
    this.status = "successful run";
  }
}
