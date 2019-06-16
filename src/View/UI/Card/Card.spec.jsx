// @flow
import React from "react";
import renderer from "react-test-renderer";

import Card from "./Card.jsx";

describe("Card", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Card
          title="Example title"
          description="Example Description"
          background={<div />}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
