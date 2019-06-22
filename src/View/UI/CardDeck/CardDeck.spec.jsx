// @flow
import React from "react";
import renderer from "react-test-renderer";
import CardDeck from "./CardDeck";

it("renders correctly", () => {
  const tree = renderer.create(<CardDeck />).toJSON();
  expect(tree).toMatchSnapshot();
});
