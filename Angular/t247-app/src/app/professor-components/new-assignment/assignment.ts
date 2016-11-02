export class Assignment {
  constructor(
    public id: number,
    public group_id: string,
    public problem_id: string,
    public title: string,
    public start_date: Date,
    public due_date: Date
  ) {  }
}
