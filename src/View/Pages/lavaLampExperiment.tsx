import * as React from "react";
import styled from "styled-components";

const SVGHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #fff7ec;
`;

const colors = ["#CD1E33", "#F8B240", "#35687C"];

const useCirclePos = (
  start: number,
  low: number,
  high: number,
  period = 1
): number => {
  const [pos, setPos] = React.useState(start);

  React.useEffect(() => {
    let start: number = null;
    let request = null;
    const render = timeStep => {
      if (!start) {
        start = timeStep;
      }
      setPos(
        (Math.sin((timeStep / 1000) * period) / 2 + 0.5) * (high - low) + low
      );
      request = window.requestAnimationFrame(render);
    };
    request = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(request);
  }, [high, low, period]);
  return pos;
};

const LavaLampExperiment = () => {
  const circleA = useCirclePos(300, 200, 400, 1.5);
  const circleB = useCirclePos(400, 300, 500, 1);
  const circleC = useCirclePos(300, 100, 500, 0.7);

  return (
    <SVGHolder>
      <svg
        version="1.1"
        x="0px"
        y="0px"
        width="600px"
        height="600px"
        viewBox="0 0 600 600"
        xmlSpace="preserve"
        style={{ border: "solid 1px black" }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9"
              result="cm"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#212121"></rect>
        <g filter="url(#goo)">
          <circle cx={circleA} cy={300} r={50} fill={colors[0]}></circle>
          <circle cx={circleB} cy={300} r={50} fill={colors[1]}></circle>
          <circle cx={circleC} cy={220} r={50} fill={colors[2]}></circle>
        </g>
      </svg>
    </SVGHolder>
  );
};

export default LavaLampExperiment;
