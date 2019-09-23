import * as React from "react";
import { TypeBox } from "../../Pages/justSomeThought";
import Vector2d from "../../../Domain/Vector/Vector2d";

const JustSomeThoughtsPreview = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const textBoxWidth = width * 0.9;
  return (
    <TypeBox
      textToType="Uncomfortably personal text"
      pos={new Vector2d((width - textBoxWidth) / 2, height / 2)}
      width={textBoxWidth}
    />
  );
};

export default JustSomeThoughtsPreview;
