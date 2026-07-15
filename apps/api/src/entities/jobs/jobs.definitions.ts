export interface Job {
  execute(): Promise<void>;
}
