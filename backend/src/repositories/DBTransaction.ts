export class DBTransaction {
  public constructor(
    public start: Function,
    public commit: Function,
    public rollback: Function
  ) {}
}
