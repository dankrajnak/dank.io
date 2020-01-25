import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { Menu } from "../../../../Domain/Menu/Menu";
import useFullScreen from "../../../Hooks/useFullScreen";
import useScrollAmount from "../../../Hooks/useScrollAmount";
import CardDeck from "./CardDeck/CardDeck";

const ScrollMessage = styled.div.attrs<{ opacity: number }>(props => ({
  style: { opacity: props.opacity },
}))`
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: small;
  color: #aaa;
  z-index: 5000;
`;

const AboutContainer = styled.div`
  position: fixed;
  top: 8%;
  left: 8%;
  width: 100%;
  a {
    text-decoration: none;
    color: #222;
    &:hover {
      border-bottom: solid 1px #222;
    }
  }
`;

/**
 * Pages are represented as cards on a deck. As the user scrolls the cards roll off the deck
 * offscreen.  Known to be a little buggy on iphones.
 */
const CardMenu: Menu = ({ routeProps, cards }) => {
  const [width, height, flash] = useFullScreen();
  const cardWidth = React.useMemo(() => Math.min(500, width * 0.9), [width]);
  const cardHeight = React.useMemo(() => Math.min(500, height * 0.7), [height]);

  const cardsWithDimensions = React.useMemo(
    () =>
      cards.map(card => ({
        ...card,
        background: <card.background width={cardWidth} height={cardHeight} />,
      })),
    [cardHeight, cardWidth, cards]
  );
  const scrollToCard = React.useMemo(() => {
    if (
      routeProps.location &&
      routeProps.location.state &&
      routeProps.location.state.prevPath
    ) {
      const prevLocation = routeProps.location.state.prevPath;
      const index = cards.findIndex(card => card.link === prevLocation);
      return index === -1 ? null : index;
    }
    return null;
  }, [cards, routeProps.location]);
  const scroll = useScrollAmount();
  if (flash) {
    return flash;
  }
  // Introduce intentional type error to check husky.
  const thing: string = 3;
  return (
    <>
      <AboutContainer>
        <Link to={"/about"}>About</Link>
      </AboutContainer>
      <CardDeck
        cards={cardsWithDimensions}
        width={width}
        cardsWidth={cardWidth}
        cardsHeight={cardHeight}
        scrollToCard={scrollToCard}
      />
      {/* 
        // @ts-ignore */}
      <ScrollMessage opacity={(1 - scroll / height) * 2 || 0}>
        Scroll Up
      </ScrollMessage>
    </>
  );
};

export default CardMenu;
