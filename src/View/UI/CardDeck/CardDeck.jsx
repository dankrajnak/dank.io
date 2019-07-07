// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import useScrollAmount from "../../Hooks/useScrollAmount";
import Card, {
  CARD_WIDTH,
  CARD_HEIGHT,
  type Props as CardProps,
} from "../Card/Card";
import useFullScreen from "../../Hooks/useFullScreen";
import stepEaser from "../../../Services/EaseStep/EaseStep.service";
import EasingFunctions from "../../../Services/Ease.service";

type Props = {
  cards: CardProps[],
  width: number,
};

const CardDeckHolder = styled.div`
  margin-left: 30px;
  width: ${props => props.width}px;
  height: 100%;
`;

const CardHolder = styled.div.attrs(props => ({
  style: {
    transform: `translate(${props.dx}px, ${props.dy}px)`,
    zIndex: 2000 - props.order,
  },
}))`
  position: fixed;
`;

const PERIOD = 0.4;
const EASING_FUNCTION = EasingFunctions.easeInOutQuart;

/**
 * Creates a scrollable Card Deck.
 * @param {Props} props
 */
const CardDeck = (props: Props) => {
  const scroll = useScrollAmount(false);
  const [windowWidth, windowHeight] = useFullScreen();
  // Memoize stepEaser to only generate range and getPosition when the cards length changes.
  const getPositionEase = useCallback(
    () => stepEaser(props.cards.length - 1, PERIOD, EASING_FUNCTION),
    [props.cards.length]
  );
  const [normScrollRange, normGetPosition] = getPositionEase();

  // Need to map values in and out of the stepEaser, which is normalized.
  // We need to map [0, 1] to [0, windowWidth] and vice-versa
  const mapToEase = useCallback(num => num / windowWidth, [windowWidth]);
  const mapFromEase = useCallback(num => num * windowWidth, [windowWidth]);

  // Get the deckWidth, add EASING_FUNCTION(1-PERIOD) to make sure the
  // second-to-last card clears the screen.
  // TODO this isn't exact.  Need to take into account deckPosition, CARD_WIDTH, etc.
  const deckWidth = mapFromEase(normScrollRange + EASING_FUNCTION(1 - PERIOD));

  // This is the position on the screen the deck sits.  It's a computed value based on the windowWidth.
  const deckPosition = useCallback(() => windowWidth - CARD_WIDTH - 80, [
    windowWidth,
  ]);
  const getPosition = useCallback(
    (scrollAmount: number, i: number) =>
      deckPosition() -
        mapFromEase(normGetPosition(mapToEase(scrollAmount), i)) ||
      deckPosition(),
    [deckPosition, mapFromEase, mapToEase, normGetPosition]
  );
  return (
    <CardDeckHolder width={deckWidth}>
      {props.cards.map((card, i) => {
        // Only draw cards when the card above it has moved and it's on screen.
        const nextCardPosition =
          i !== props.cards.length - 1
            ? getPosition(scroll, i + 1)
            : deckPosition();
        const currentCardPosition = getPosition(scroll, i);
        const prevCardPosition =
          i !== 0 ? getPosition(scroll, i - 1) : mapFromEase(1);

        const shouldNotDrawCard =
          (currentCardPosition === nextCardPosition &&
            currentCardPosition !== deckPosition()) ||
          prevCardPosition === deckPosition();

        return (
          <CardHolder
            dx={
              i === props.cards.length - 1
                ? deckPosition()
                : currentCardPosition
            }
            dy={(windowHeight - CARD_HEIGHT) / 2}
            key={i}
            order={i}
          >
            {!shouldNotDrawCard && (
              <Card
                {...card}
                shadowAmount={
                  i === props.cards.length - 1
                    ? 0
                    : normGetPosition(mapToEase(scroll), i)
                }
              />
            )}
          </CardHolder>
        );
      })}
    </CardDeckHolder>
  );
};
export default CardDeck;
