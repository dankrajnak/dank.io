import * as React from "react";

export default interface Card {
  background: React.FunctionComponent<{ width: number; height: number }>;
  title: string;
  description: React.ReactNode;
  link: string;
}
