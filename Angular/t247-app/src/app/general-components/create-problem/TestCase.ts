/**
 * Created by Alfredo Hinojosa on 10/3/2016.
 */


/**
 * This class reflects all the information that a Test Case can have
 */

export class TestCase {

  public is_sample: boolean; // This flag specifies if the test cases will be added to description or not
  public input: string; // Input to test in the evaluator
  public output: string; // The output generated for this problem
  public feedback: string; // The feedback provided by the author of the problem
  public status: string; // This field contains the status of the evaluation for this test case

  constructor(onDescription: boolean, input?: string, output?: string, feedback?: string) {
    this.is_sample = onDescription;
    this.status = "successful run";
    this.input = input;
    this.output = output;
    this.feedback = feedback;
  }

}
