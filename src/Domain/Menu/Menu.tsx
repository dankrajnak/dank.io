import * as React from "react";
import Card from "../Card/Card";
import { Location } from "history";
import { RouteComponentProps } from "@reach/router";

type PropsPassedThroughLocationState = {
  prevPath: string | null;
};

export type Menu = React.FunctionComponent<{
  routeProps: RouteComponentProps<{
    location: Location<PropsPassedThroughLocationState>;
  }>;
  cards: Card[];
}>;
