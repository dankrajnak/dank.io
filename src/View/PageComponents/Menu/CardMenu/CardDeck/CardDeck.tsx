import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import useScrollAmount from "../../../../Hooks/useScrollAmount";
import Card, { Props as CardProps } from "../Card/Card";
import useFullScreen from "../../../../Hooks/useFullScreen";
import { mappedStepEaser } from "../../../../../Services/EaseStep/EaseStep.service";
import EasingFunctions from "../../../../../Services/Ease/Ease.service";
import { Link } from "gatsby";
import useSafeWindow from "../../../../Hooks/useSafeWindow";

// TODO find a better way to do this.
// @ts-ignore
const { width, height, ...CardPropsSubset }: CardProps = {};
interface Props {
  cards: ({
    link: string;
  } & typeof CardPropsSubset)[];
  width: number;
  cardsWidth: number;
  cardsHeight: number;
  scrollToCard?: number | null;
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
` as StyledComponent<
  "div",
  any,
  { dx: number; dy: number; order: number },
  never
>;

const PERIOD = 0.4;
const EASING_FUNCTION = EasingFunctions.easeInOutQuart;

/**
 * Creates a scrollable Card Deck.
 * @param {Props} props
 */
const CardDeck = (props: Props) => {
  const scroll = useScrollAmount(true);
  const [window] = useSafeWindow();

  const [windowWidth, windowHeight, flash] = useFullScreen();

  // This is the position on the screen the deck sits.  It's a computed value based on the windowWidth.
  const deckPosition = React.useMemo(
    () => (windowWidth - props.cardsWidth) / 2,
    [props.cardsWidth, windowWidth]
  );

  const scrollDemap = React.useMemo(
    () => (val: number) => deckPosition - windowWidth * val,
    [deckPosition, windowWidth]
  );

  const scrollLength = windowHeight * 5;
  const cardPositionStart = deckPosition;
  const cardPositionEnd = -props.cardsWidth;
  // Memoize stepEaser to only generate range and getPosition when the cards length changes.
  const [getPosition, getEaseStart] = React.useMemo(
    () =>
      mappedStepEaser(
        0,
        scrollLength,
        cardPositionStart,
        cardPositionEnd
      )(props.cards.length - 1, PERIOD, EASING_FUNCTION),
    [cardPositionEnd, cardPositionStart, props.cards.length, scrollLength]
  );

  // Move to the saved scroll position when this component renders
  React.useLayoutEffect(() => {
    let timeout: number;
    if (window) {
      if (props.scrollToCard) {
        //Ok, this is hacky, but unless we wait a few milliseconds,
        // the screen doesn't have time to render and we don't scroll anywhere.
        // As far as I can tell for now, there's no way to listen for when all the cards have been rendered
        setTimeout(() => {
          if (props.scrollToCard) {
            window.scrollTo(
              0,
              // Add a little to the index to give make sure the card on top has moved off of the card below
              // TODO this should take the easing function into account.
              getEaseStart(props.scrollToCard + 2 / props.cards.length)
            );
          }
        }, 15);
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [getEaseStart, props.cards.length, props.scrollToCard, window]);

  if (flash) {
    return flash;
  }
  return (
    <CardDeckHolder height={scrollLength + windowHeight}>
      {props.cards.map((card, i) => {
        // Only draw cards when the card above it has moved and it's on screen.
        const nextCardPosition =
          i !== props.cards.length - 1
            ? getPosition(scroll, i + 1)
            : cardPositionStart;
        const currentCardPosition = getPosition(scroll, i);
        const prevCardPosition =
          i !== 0 ? getPosition(scroll, i - 1) : cardPositionEnd;

        const shouldNotDrawCard =
          (currentCardPosition === nextCardPosition &&
            currentCardPosition !== deckPosition) ||
          prevCardPosition === cardPositionStart;

        return (
          <Link to={card.link} key={i} className="card-deck-card-link">
            <CardHolder
              dx={
                i === props.cards.length - 1
                  ? cardPositionStart
                  : currentCardPosition
              }
              dy={(windowHeight - props.cardsHeight) / 2}
              order={i}
            >
              {!shouldNotDrawCard && (
                <Card
                  {...card}
                  width={props.cardsWidth}
                  height={props.cardsHeight}
                  shadowAmount={
                    i === props.cards.length - 1
                      ? 0
                      : scrollDemap(getPosition(scroll, i))
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
