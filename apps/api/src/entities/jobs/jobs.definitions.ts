export interface Job<T = object> {
  execute(body?: T): Promise<void>;
}
