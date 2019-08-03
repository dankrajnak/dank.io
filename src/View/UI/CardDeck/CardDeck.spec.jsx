import React from "react";
import renderer from "react-test-renderer";
import CardDeck from "./CardDeck";

it("renders with no cards", () => {
  const tree = renderer.create(<CardDeck cards={[]} />).toJSON();
  expect(tree).toMatchSnapshot();
});
