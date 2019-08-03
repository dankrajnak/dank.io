import React from "react";
import renderer from "react-test-renderer";
import CanvasDrawer from "./CanvasDrawer";

const getArtist = () => {
  let count = 0;
  return (context?: CanvasRenderingContext2D) => count++;
};
it("renders correctly", () => {
  const tree = renderer
    .create(<CanvasDrawer width={200} height={200} artist={getArtist()} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders at 50fps", () => {
  const artist = getArtist();
  renderer.create(
    <CanvasDrawer width={200} height={200} artist={artist} fps={80} />
  );
});
