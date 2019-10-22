import * as React from "react";
import MenuLayout from "../Layout/MenuLayout";
import Vector2d from "../../Domain/Vector/Vector2d";
import useFullScreen from "../Hooks/useFullScreen";
import Action from "../../Domain/Action/Action";
import TypeBox from "../PageComponents/JustSomeThought/TypeBox";
import LongText from "../PageComponents/JustSomeThought/LongText";

const TheThoughts: string[] = [
  "It still comes back to you",
  "Alone and being here, not new",
  "Still want runaway rules and nothing to pursue",
  "Still want that all talk and just do",
  "I wanna be like shoes, slip me on and just groove",
  "Be the one, like cool, growing up in pews",
  "Tuseday night, found something to do, not you",
  "I keep trying to improve",
  "Can't do anything, just lose",
  "Can't be someone, he proved",
  "Jump in, swirl around, just move",
  "Remember those nights not blue",
  "Remember those nights that include you",
  "I'm just trying to conclude something I can pack up and move to",
  "Get out of that place you just blew through",
  "Prove to myself I can move too",
  "Or find myself on that middle-aged accrue",
  "Find something on view I can booze to",
  "Find some friends, just a few",
  "Find a guy almost like you",
  "Watch me get up and make something new",
  "Watch me never worry about being you",
];

interface State {
  maxElements: number;
  numElementsBeforeWhite: number;
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
        state.nextKey > state.numElementsBeforeWhite
      ) {
        return state;
      }
      if (state.elements.find(elm => elm.key === action.payload.key)) {
        throw new Error(`Element with key ${action.payload.key} already added`);
      }
      return {
        ...state,
        elements: state.elements.concat([action.payload]),
        nextKey: state.nextKey + 1,
      };
    case "ADD_ELEMENTS":
      if (state.elements.length + action.payload.length > state.maxElements) {
        return state;
      }
      if (
        action.payload.some(
          elm => !!state.elements.find(stateElm => stateElm.key === elm.key)
        )
      ) {
        throw new Error(
          `Element with key in list ${action.payload
            .map(elm => elm.key)
            .join(", ")} already added`
        );
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
      if (action.payload < 0) {
        throw new Error(
          `Tried to set timeout to value less than 0 -- ${action.payload}`
        );
      }
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
    numElementsBeforeWhite: 100,
    elements: [],
    nextKey: 0,
    timeOut: 3000,
  });
  const [showLongText, setShowLongText] = React.useState(false);
  const [width, height, flash] = useFullScreen();

  React.useEffect(() => {
    if (state.nextKey > state.numElementsBeforeWhite) {
      return;
    }
    const timeout = setTimeout(() => {
      const minTextWidth = 200;
      const textWidth =
        minTextWidth + Math.random() * Math.min(500, width - minTextWidth);
      const position = new Vector2d(
        Math.random() * (width - textWidth),
        Math.random() * height - 20
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
              color={`rgba(0,0,0, ${Math.max(
                0,
                1 - state.nextKey / state.numElementsBeforeWhite
              )})`}
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
  }, [
    height,
    state.elements,
    state.maxElements,
    state.nextKey,
    state.numElementsBeforeWhite,
    state.timeOut,
    width,
  ]);

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
