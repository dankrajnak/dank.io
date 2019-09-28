export default interface Action<T extends string = string, P = any> {
  type: T;
  payload: P;
}
