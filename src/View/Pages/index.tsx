import * as React from "react";
import styled from "styled-components";
import SEO from "../Utility/seo";
import useFullScreen from "../Hooks/useFullScreen";
import TheCoolestOne from "../PageComponents/Homepage/TheCoolestOne";
import MenuLayout from "../Layout/MenuLayout";
import Lorenz from "../PageComponents/Homepage/Lorenz";
import useScrollThreshold from "../Hooks/useScrollTreshold";
import throttle from "../../Services/Throttle/Throttle.service";
import useWindowEvent from "../Hooks/useWindowEvent";

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
const Fader = styled.div<{ visible: boolean }>`
  position: fixed;
  opacity: ${(props): number => (props.visible ? 1 : 0)};
  transition: opacity 1s ease;
`;

const NUM_PAGES = 3;

const IndexPage = (): React.ReactNode => {
  const [width, height] = useFullScreen();
  const [currentPage, setCurrentPage] = React.useState(0);
  const incrementPage = () =>
    setCurrentPage(page => Math.min(page + 1, NUM_PAGES - 1));
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
    <MenuLayout color={currentPage === 0 ? "white" : "black"}>
      <SEO title="Home" keywords={["daniel", "krajnak", "portfolio"]} />
      {currentPage === 0 && (
        <Fader visible={currentPage === 0}>
          <TitleHolder>
            <Title color="#EEE">Hi hi hi</Title>
          </TitleHolder>
          <Lorenz width={width} height={height} />
        </Fader>
      )}
      <Fader visible={currentPage === 1}>
        <TitleHolder>
          <Title> again, again again</Title>
        </TitleHolder>
        <TheCoolestOne width={width} height={height} />
      </Fader>
      <Fader visible={currentPage === 2}>
        <TitleHolder>
          <Title>agin again agian</Title>
        </TitleHolder>
      </Fader>
    </MenuLayout>
  );
};

export default IndexPage;
