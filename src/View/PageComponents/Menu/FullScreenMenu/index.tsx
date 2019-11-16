import * as React from "react";
import { Menu } from "../../../../Domain/Menu/Menu";
import styled from "styled-components";
import useFullScreen from "../../../Hooks/useFullScreen";
import Fader from "../../../UI/Fader";
import useScrollThreshold from "../../../Hooks/useScrollTreshold";
import useWindowEvent from "../../../Hooks/useWindowEvent";
import throttle from "../../../../Services/Throttle/Throttle.service";

const TitleHolder = styled.div`
  position: fixed;
  z-index: 0;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1<{ color?: string }>`
  color: ${(props): string => props.color || "#2f3030"};
  font-size: 2em;
  font-weight: 500;
  text-align: center;
`;

const fadeStyles = (visible: boolean) => ({
  // position: "fixed",
  opacity: visible ? 1 : 1,
  transition: "opacity 1s ease",
});

const FullScreenMenu: Menu = ({ cards, routeProps }) => {
  const [width, height] = useFullScreen();
  const [currentPage, setCurrentPage] = React.useState(0);
  const incrementPage = () => {
    setCurrentPage(curPage => (curPage + 1) % cards.length);
  };

  const decrementPage = () => setCurrentPage(page => Math.max(page - 1, 0));

  useScrollThreshold(val => {
    if (val > 0) {
      incrementPage();
    } else {
      decrementPage();
    }
  });
  useWindowEvent(
    "keydown",
    throttle((e: KeyboardEvent) => {
      // Up arrow
      if (e.keyCode === 38) {
        decrementPage();
      }
      // Down arrow
      else if (e.keyCode === 40) {
        incrementPage();
      }
    }, 100)
  );
  return (
    <div>
      <Fader visible={currentPage === 0}>
        <Title>Hey. This is my website.</Title>
      </Fader>
      {cards.map((card, index) => (
        <Fader visible={currentPage === index + 1} key={index + card.title}>
          {/* <TitleHolder>
            <Title>{card.title}</Title>
          </TitleHolder> */}
          <card.background width={width} height={height} />
        </Fader>
      ))}
    </div>
  );
};

export default FullScreenMenu;
