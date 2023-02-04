export type Instantiable<T = any> = { new (...args: any[]): T };

export interface IHasId {
  id: string;
}
