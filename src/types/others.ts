import { type ReactNode } from "react";

export interface KeyValueObj {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface IStat {
  title: string;
  icon: ReactNode;
  value: string;
  color: string;
}
