// @flow
import React, { useState, useRef } from "react";
import styled from "styled-components";
import SEO from "../Utility/seo";
import useFullScreen from "../Hooks/useFullScreen";
import TheCoolestOne from "../Components/DoublePendulums/TheCoolestOne";
import MenuLayout from "../Layout/MenuLayout.jsx";
import Lorenz from "../Components/Lorenz";
import useScrollThreshold from "../Hooks/useScrollTreshold";
import Help from "../UI/Help/Help";
import useMousePosition from "../Hooks/useMousePosition";

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
  font-size: 2em;
  font-weight: 500;
  text-align: center;
`;
const Fader = styled.div`
  position: fixed;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 1s ease;
`;

const NUM_PAGES = 3;
const IndexPage = () => {
  const [width, height, flash] = useFullScreen();
  const [currentPage, setCurrentPage] = useState(0);
  const lorenzFader = useRef(null);
  const [x, y] = useMousePosition(lorenzFader, false);

  useScrollThreshold(val =>
    val > 0
      ? setCurrentPage(page => Math.min(page + 1, NUM_PAGES - 1))
      : setCurrentPage(page => Math.max(page - 1, 0))
  );
  if (flash) {
    return flash;
  }
  return (
    <MenuLayout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      {currentPage === 0 && (
        <Fader visible={currentPage === 0}>
          <TitleHolder>
            <Title color="#EEE">When I think about summer,</Title>
          </TitleHolder>
          <Lorenz
            width={width}
            height={height}
            label="home"
            getXandY={() => [x, y]}
          />
        </Fader>
      )}
      <Fader visible={currentPage === 1}>
        <TitleHolder>
          <Title>I don't think about you.</Title>
        </TitleHolder>
        <TheCoolestOne width={width} height={height} />
      </Fader>
      <Fader visible={currentPage === 2}>
        <TitleHolder>
          <Title>I'm trying not to think about you.</Title>
        </TitleHolder>
      </Fader>
    </MenuLayout>
  );
};

export default IndexPage;
