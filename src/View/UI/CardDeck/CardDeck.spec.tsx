import * as React from "react";
import * as renderer from "react-test-renderer";
import CardDeck from "./CardDeck";

it("renders with no cards", () => {
  const tree = renderer.create(<CardDeck width={300} cards={[]} />).toJSON();
  expect(tree).toMatchSnapshot();
});
