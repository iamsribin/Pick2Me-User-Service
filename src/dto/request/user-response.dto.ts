import { StatusCode } from "../common";

export interface IResponse<T> {
  status: StatusCode;
  message: string;
  navigate?: string | number;
  data?: T | null | [] | boolean;
}