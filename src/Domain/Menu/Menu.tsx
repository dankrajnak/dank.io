import * as React from "react";
import Card from "../Card/Card";
import { RouteComponentProps } from "@reach/router";

export type Menu = React.FunctionComponent<{
  routeProps: RouteComponentProps;
  cards: Card[];
}>;
