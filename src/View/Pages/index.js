// @flow
import React, { useState } from "react";
import styled from "styled-components";
import SEO from "../Utility/seo";
import useFullScreen from "../Hooks/useFullScreen";
import TheCoolestOne from "../Components/DoublePendulums/TheCoolestOne";
import MenuLayout from "../Layout/MenuLayout.jsx";
import Lorenz from "../Components/Lorenz";
import useScrollThreshold from "../Hooks/useScrollTreshold";
import ThreeContainer from "../UI/ThreeContainer";
import useDynamicLoad from "../Hooks/useDynamicLoad";
import typeof * as HallwayServiceModuleType from "../../Services/Hallway.service";

const TitleHolder = styled.div`
  position: fixed;
  z-index: 0;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${props => props.color || props.theme.text.headerColor};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 2em;
  font-weight: 500;
  text-align: center;
`;
const Fader = styled.div`
  position: fixed;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 2s ease;
`;

const hallwayServicePromise: Promise<HallwayServiceModuleType> = import(
  "../../Services/Hallway.service"
);

const IndexPage = () => {
  const [width, height] = useFullScreen();
  console.log(width, height);
  const [currentPage, setCurrentPage] = useState(0);
  const [thirdPageReady, hallwayService] = useDynamicLoad(
    hallwayServicePromise
  );
  useScrollThreshold(val =>
    val > 0
      ? setCurrentPage(page => Math.min(page + 1, 2))
      : setCurrentPage(page => Math.max(page - 1, 0))
  );
  return (
    <MenuLayout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      {currentPage === 0 && (
        <Fader visible={currentPage === 0}>
          <TitleHolder>
            <Title color="#EEE">When I think about summer,</Title>
          </TitleHolder>
          <Lorenz width={width} height={height} />
        </Fader>
      )}
      <Fader visible={currentPage === 1}>
        <TitleHolder>
          <Title>I don't think about you.</Title>
        </TitleHolder>
        <TheCoolestOne width={width} height={height} />
      </Fader>

      {thirdPageReady && !!hallwayService && currentPage === 2 && (
        <Fader visible={currentPage === 2}>
          <TitleHolder>
            <Title color="#EEE">I don't think about you.</Title>
          </TitleHolder>
          <ThreeContainer
            start={hallwayService.start}
            stop={hallwayService.stop}
            style={{ width: `${width}px`, height: `${height}px` }}
          />
        </Fader>
      )}
    </MenuLayout>
  );
};

export default IndexPage;
