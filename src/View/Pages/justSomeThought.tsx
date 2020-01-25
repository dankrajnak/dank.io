import * as React from "react";
import MenuLayout from "../Layout/MenuLayout";
import Vector2d from "../../Domain/Vector/Vector2d";
import useFullScreen from "../Hooks/useFullScreen";
import Action from "../../Domain/Action/Action";
import TypeBox from "../PageComponents/JustSomeThought/TypeBox";
import LongText from "../PageComponents/JustSomeThought/LongText";
import SEO from "../Utility/seo";

const TheThoughts: string[] = [
  "It still comes back to you",
  "Alone and being here, not new",
  "Still want runaway rules and nothing to pursue",
  "Still want that all talk and just do",
  "I wanna be like shoes, slip me on and just groove",
  "Forget those nights that include you",
  "Jump in, swirl around, just move",
  "I keep trying to improve",
  "Can't do anything, just lose",
  "Can't listen to that song we used to",
  "I'm just trying to conclude something I can pack up and move to",
  "Get out of that place you just blew through",
  "Prove to myself I can move too",
  "Or find myself on that middle-aged accrue",
  "Find something on view I can booze to",
  "Find some friends, just a few",
  "Find a guy almost like you",
  "Watch me get up and make something new",
  "Watch me never worry about seeing you",
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
type RemoveElementAction = Action<"REMOVE_ELEMENT", number>;
type SetTimeoutAction = Action<"SET_TIMEOUT", number>;
type NudgeMaxElements = Action<"NUDGE_MAX_ELEMENTS", number>;

const reducer = (
  state: State,
  action:
    | AddElementAction
    | RemoveElementAction
    | SetTimeoutAction
    | NudgeMaxElements
): State => {
  switch (action.type) {
    case "ADD_ELEMENT":
      // Don't add another element if we're at max, or if this element is already included
      if (
        state.elements.length >= state.maxElements ||
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
    case "NUDGE_MAX_ELEMENTS":
      console.log("New max elements", state.maxElements + action.payload);
      return {
        ...state,
        maxElements: Math.max(0, state.maxElements + action.payload),
      };
    default:
      return state;
  }
};

const JustSomeThoughts = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    maxElements: 1,
    numElementsBeforeWhite: 100,
    elements: [],
    nextKey: 0,
    timeOut: 2000,
  });
  const [showLongText, setShowLongText] = React.useState(false);
  const [width, height, flash] = useFullScreen();
  const maxElementsTimeout = React.useRef(20);

  React.useEffect(() => {
    //Periodically increase max elements.
    const interval = setInterval(() => {
      dispatch({
        type: "NUDGE_MAX_ELEMENTS",
        payload: 1,
      });
      maxElementsTimeout.current = Math.max(10, maxElementsTimeout.current - 2);
    }, maxElementsTimeout.current * 1000);
    return () => clearInterval(interval);
  }, []);

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
      <SEO
        title="Just Some Thought"
        keywords={["poetry", "new media", "thought"]}
      />
      {showLongText && <LongText />}
      {state.elements.map(elm => elm.component)}
    </MenuLayout>
  );
};

export default JustSomeThoughts;
