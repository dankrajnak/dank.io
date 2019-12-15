import * as React from "react";
import { Menu } from "../../../../Domain/Menu/Menu";
import styled from "styled-components";
import Vector2d from "../../../../Domain/Vector/Vector2d";

const TITLE_SIZE = { x: 400, y: 300 };
const BLACK = "#1f1f1f";

const FullScreen = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #1f1f1f;
`;

const TitleHolder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  background-color: #1f1f1f;
  transform: translate(-50%, -50%);
`;

const WhiteText = styled.div`
  font-size: 64px;
  font-weight: 700;
  font-family: "Avenir Next";
  color: white;
  background: ${BLACK};
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  clip-path: url(#myPath);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OutlineText = styled.div`
  font-size: 64px;
  font-weight: 700;
  color: #1f1f1f;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: white;
  font-family: "Avenir Next";
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 0;
  position: absolute;
`;

const SVG = styled.svg`
  width: ${TITLE_SIZE.x}px;
  height: ${TITLE_SIZE.y}px;
`;

const getControlFromPrevPoint = (
  prevControl: Vector2d,
  current: Vector2d
): Vector2d => current.times(2).minus(prevControl);

const pointsToString = (vectors: Vector2d[]) => {
  const first = vectors[0];
  let path = `M ${first.x} ${first.y} `;
  for (let i = 1; i < vectors.length; i++) {
    const previous = vectors[i - 1];
    const current = vectors[i];
    const control = getControlFromPrevPoint(previous, current);
    path += `Q ${current.x} ${current.y} ${control.x} ${control.y} `;
  }
  // (2*curx - oldx2, 2*cury - oldy2)
  return path + "z";
};

const drawSmoothTriangle = ([a, b, c]: [
  Vector2d,
  Vector2d,
  Vector2d
]): string => {
  // Figure out last control point
  const lastControl = c.minus(b).plus(a);
  const firstControl = a.times(2).minus(lastControl);

  return `M ${a.x} ${a.y} Q ${firstControl.x} ${firstControl.y} ${b.x} ${b.y} T ${c.x} ${c.y} T ${a.x} ${a.y} z`;
};

const drawSmoothShape = (points: Vector2d[]): string => {
  const lastControl = points.reduce(
    (sum, currentPoint, index) =>
      sum.plus(currentPoint.times(index % 2 === 0 ? -1 : 1)),
    new Vector2d(0, 0)
  );
  const firstControl = points[0].times(2).minus(lastControl);

  return (
    `M ${points[0].x} ${points[0].y} Q ${firstControl.x} ${firstControl.y} ${points[1].x} ${points[1].y} ` +
    points
      .slice(1)
      .map(point => `T ${point.x} ${point.y}`)
      .join(" ") +
    `T ${points[0].x} ${points[0].y} z`
  );
};

const BlobMenu: Menu = ({ cards, routeProps }) => {
  // const [points, setPoints] = React.useState([
  //   new Vector2d(15, 10),
  //   new Vector2d(60, 10),
  //   new Vector2d(60, 60),
  //   new Vector2d(15, 60),
  // ]);

  // Vary the last leg of the triangle to see how things go
  const [lastLeg, setLastLeg] = React.useState(new Vector2d(250, 300));

  // FUCK IT TRINAGLE.
  const triangle: [Vector2d, Vector2d] = [
    new Vector2d(200, 200),
    new Vector2d(300, 200),
  ];

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLastLeg(l =>
        l.plus(new Vector2d(Math.random() * 10 - 5, Math.random() * 10 - 5))
      );
    }, 40);
    return () => clearTimeout(timeout);
  }, [lastLeg]);
  // Let's just make a square.  I just want to see it.

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     const mappedPoints = points.map(p =>
  //       p
  //         .plus(new Vector2d(Math.random() * 3 - 1.5, Math.random() * 3 - 1.5))
  //         .abs()
  //     );
  //     setPoints(mappedPoints);
  //   }, 10000);
  // }, [points]);

  //Let's make an svg.
  // const pathString = pointsToString(points);
  return (
    <FullScreen>
      <TitleHolder>
        <WhiteText>Dank.io</WhiteText>
        <OutlineText>Dank.io</OutlineText>
        <SVG>
          <clipPath id="myPath">
            <path d={drawSmoothTriangle([...triangle, lastLeg])} />
          </clipPath>
        </SVG>
      </TitleHolder>
    </FullScreen>
  );
};

export default BlobMenu;
