import * as React from "react";
import styled from "styled-components";
import useScrollAmount from "../../Hooks/useScrollAmount";
import Card, {
  CARD_WIDTH,
  CARD_HEIGHT,
  Props as CardProps,
} from "../Card/Card";
import useFullScreen from "../../Hooks/useFullScreen";
import stepEaser from "../../../Services/EaseStep/EaseStep.service";
import EasingFunctions from "../../../Services/Ease/Ease.service";
import { Link } from "gatsby";

interface Props {
  cards: ({
    link: string;
  } & CardProps)[];
  width: number;
}
const CardDeckHolder = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  width: 100%;
`;

const CardHolder = styled.div.attrs<{ dx: number; dy: number; order: number }>(
  props => ({
    style: {
      transform: `translate(${props.dx}px, ${props.dy}px)`,
      zIndex: 2000 - props.order,
    },
  })
)`
  position: fixed;
`;

const PERIOD = 0.4;
const EASING_FUNCTION = EasingFunctions.easeInOutQuart;

/**
 * Creates a scrollable Card Deck.
 * @param {Props} props
 */
const CardDeck = (props: Props) => {
  const scroll = useScrollAmount(true);
  const [windowWidth, windowHeight, flash] = useFullScreen();
  // Memoize stepEaser to only generate range and getPosition when the cards length changes.
  const getPositionEase = React.useCallback(
    () => stepEaser(props.cards.length - 1, PERIOD, EASING_FUNCTION),
    [props.cards.length]
  );
  const [normScrollRange, normGetPosition] = getPositionEase();

  // Get the deckWidth, add EASING_FUNCTION(1-PERIOD) to make sure the
  // second-to-last card clears the screen.
  // TODO this isn't exact.  Need to take into account deckPosition, CARD_WIDTH, etc.
  const deckWidth =
    windowHeight * (normScrollRange + EASING_FUNCTION(1 - PERIOD));

  // This is the position on the screen the deck sits.  It's a computed value based on the windowWidth.
  const deckPosition = React.useMemo(() => (windowWidth - CARD_WIDTH) / 2, [
    windowWidth,
  ]);
  const getPosition = React.useCallback(
    (scrollAmount: number, i: number) =>
      deckPosition -
        windowWidth * normGetPosition(scrollAmount / windowHeight, i) ||
      deckPosition,
    [deckPosition, normGetPosition, windowHeight, windowWidth]
  );
  if (flash) {
    return flash;
  }
  return (
    <CardDeckHolder height={deckWidth}>
      {props.cards.map((card, i) => {
        // Only draw cards when the card above it has moved and it's on screen.
        const nextCardPosition =
          i !== props.cards.length - 1
            ? getPosition(scroll, i + 1)
            : deckPosition;
        const currentCardPosition = getPosition(scroll, i);
        const prevCardPosition =
          i !== 0 ? getPosition(scroll, i - 1) : windowWidth;

        const shouldNotDrawCard =
          (currentCardPosition === nextCardPosition &&
            currentCardPosition !== deckPosition) ||
          prevCardPosition === deckPosition;

        return (
          <Link to={card.link} key={i}>
            {/* 
            // @ts-ignore */}
            <CardHolder
              dx={
                i === props.cards.length - 1
                  ? deckPosition
                  : currentCardPosition
              }
              dy={(windowHeight - CARD_HEIGHT) / 2}
              order={i}
            >
              {!shouldNotDrawCard && (
                <Card
                  {...card}
                  shadowAmount={
                    i === props.cards.length - 1
                      ? 0
                      : normGetPosition(scroll / windowHeight, i)
                  }
                />
              )}
            </CardHolder>
          </Link>
        );
      })}
    </CardDeckHolder>
  );
};
export default CardDeck;
