import * as React from "react";
import * as renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import Theme from "../../Utility/theme";

import Card from "./Card";

describe("Card", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <Card
            title="Example title"
            description="Example Description"
            background={<div />}
          />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});