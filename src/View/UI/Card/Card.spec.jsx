import React from "react";
import renderer from "react-test-renderer";

import Card from "./Card.jsx";

describe("Card", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Card siteTitle="Default Starter" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
