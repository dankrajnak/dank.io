import * as React from "react";
import MenuLayout from "../Layout/MenuLayout";
import Vector2d from "../../Domain/Vector/Vector2d";
import useFullScreen from "../Hooks/useFullScreen";
import Action from "../../Domain/Action/Action";
import TypeBox from "../PageComponents/JustSomeThought/TypeBox";
import LongText from "../PageComponents/JustSomeThought/LongText";

const TheThoughts: string[] = [
  "I want desperately to be interesting",
  "but I'm not sure how to be anymore",
  "and honestly, maybe making this whole site is my attempt to prove to myself that I can make something nice",
  "because it's difficult to make something nice",
  "and doing difficult things is interesting",
  "Again and again, though, I end up searching for something to say",
  "The truth is I'm not interesting to me anymore and I have nothing to say",
  "Maybe I favor self-deprication because it indicates that I've struggled with something and therefore have something to express",
  "I make things up because I'm wholly uninteresting",
  "I can't make good art",
  "I'm not an artist and calling myself that is just silly",
  "I have nothing to say",
  "and nothing to contribute",
  "What makes me feel secure?",
  "Am I just looking to feel insecure because the only art I know how to make is a cry for help?",
  "Is this supposed to be fulfilling?",
  "Gotta say I'm pretty proud of what you're turning into",
  "Put colors back on the table",
];

interface State {
  maxElements: number;
  elements: { key: number; component: React.ReactNode }[];
  nextKey: number;
  timeOut: number;
}

type AddElementAction = Action<
  "ADD_ELEMENT",
  { key: number; component: React.ReactNode }
>;
type AddElementsAction = Action<
  "ADD_ELEMENTS",
  { key: number; component: React.ReactNode }[]
>;
type RemoveElementAction = Action<"REMOVE_ELEMENT", number>;
type SetTimeoutAction = Action<"SET_TIMEOUT", number>;

const reducer = (
  state: State,
  action:
    | AddElementAction
    | RemoveElementAction
    | SetTimeoutAction
    | AddElementsAction
): State => {
  switch (action.type) {
    case "ADD_ELEMENT":
      // Don't add another element if we're at max, or if this element is already included
      if (
        state.elements.length === state.maxElements ||
        state.elements.find(elm => elm.key === action.payload.key)
      ) {
        return state;
      }
      return {
        ...state,
        elements: state.elements.concat([action.payload]),
        nextKey: state.nextKey + 1,
      };
    case "ADD_ELEMENTS":
      if (
        state.elements.length + action.payload.length > state.maxElements ||
        action.payload.some(
          elm => !!state.elements.find(stateElm => stateElm.key === elm.key)
        )
      ) {
        return state;
      }
      return {
        ...state,
        elements: state.elements.concat(action.payload),
        nextKey: state.nextKey + action.payload.length,
      };
    case "REMOVE_ELEMENT":
      return {
        ...state,
        elements: state.elements.filter(elm => elm.key !== action.payload),
      };
    case "SET_TIMEOUT":
      return {
        ...state,
        timeOut: action.payload,
      };
    default:
      return state;
  }
};

const JustSomeThoughts = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    maxElements: 20,
    elements: [],
    nextKey: 0,
    timeOut: 3000,
  });
  const [showLongText, setShowLongText] = React.useState(false);
  const [width, height, flash] = useFullScreen();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const textWidth = 200 + Math.random() * 500;
      const position = new Vector2d(
        Math.random() * (width - textWidth),
        Math.random() * height
      );
      const textToType = TheThoughts[state.nextKey % TheThoughts.length];

      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          key: state.nextKey,
          component: (
            <TypeBox
              key={state.nextKey}
              textToType={textToType}
              width={textWidth}
              pos={position}
              unType
              onFinish={() =>
                dispatch({ type: "REMOVE_ELEMENT", payload: state.nextKey })
              }
            />
          ),
        },
      });

      dispatch({
        type: "SET_TIMEOUT",
        payload: Math.max(0, state.timeOut * 0.95),
      });
    }, state.timeOut);
    return () => {
      clearTimeout(timeout);
    };
  }, [height, state.elements, state.nextKey, state.timeOut, width]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLongText(true);
    }, 25000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (flash) {
    return flash;
  }

  return (
    <MenuLayout color="black">
      {showLongText && <LongText />}
      {state.elements.map(elm => elm.component)}
    </MenuLayout>
  );
};

export default JustSomeThoughts;
