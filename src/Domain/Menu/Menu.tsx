import * as React from "react";
import Card from "../Card/Card";
import { Location } from "history";
import { RouteComponentProps } from "@reach/router";

type PropsPassedThroughLocationState = {
  prevPath: string | null;
};
/**
 * This is the best I can do, but probably flawed.  At times, pages will store the previousPath
 * on location state.  This is an attempt to somewhat override RouteComponentProps from the router
 * to include this property.
 */
export type MenuRouteProps = RouteComponentProps<{
  location: Location<PropsPassedThroughLocationState> & Window["location"];
}>;

export type Menu = React.FunctionComponent<{
  routeProps: MenuRouteProps;
  cards: Card[];
}>;
