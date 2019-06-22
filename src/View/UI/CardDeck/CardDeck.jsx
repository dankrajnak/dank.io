// @flow
import React, { type ChildrenArray, type Element } from "react";
import styled from "styled-components";
import useScrollAmount from "../../Hooks/useScrollAmount";
import useFullScreen from "../../Hooks/useFullScreen";
import Card, { type Props as CardProps } from "../Card/Card";

type Props = {
  cards: CardProps[],
};

const CardDeckHolder = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  & > div {
    margin: 0 30px;
  }
`;

const CardHolder = styled.div`
  transform: translate(${props => props.dx}px, 0px);
`;

const CardDeck = (props: Props) => {
  const scroll = useScrollAmount(false);
  const [width] = useFullScreen();
  return (
    <CardDeckHolder>
      {props.cards.map((card, i) => {
        const dx = (i * width) / 5;
        return (
          <CardHolder dx={dx} key={i}>
            <Card
              {...card}
              shadowAmount={(props.cards.length - i) * (scroll / width)}
            />
          </CardHolder>
        );
      })}
    </CardDeckHolder>
  );
};
export default CardDeck;
