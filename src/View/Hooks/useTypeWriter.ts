import { Action } from "../../Domain/Action/Action";
import * as React from "react";
import TypeWriterService from "../../Services/TypeWriter/TypeWriter.service";

/**
 * A representation of a delayed state of the typed text.
 */
interface DelayNode {
  /**
   * The value of the text after the delay
   */
  text: string;
  /**
   * The delay in  miliseconds
   */
  delay: number;
  /**
   * A listener that should be called after this delay node executed.
   */
  listener?: () => void;
}

/**
 * Configure a delay
 * (typing seems more natural when it takes a semi-random amount of time between each character)
 */
interface DelayConfig {
  base: number;
  variance: number;
}

/**
 * The state maintained by the reducer.
 */
interface State {
  /**
   * Current value of the typed text
   */
  currentValue: string;
  /**
   * Sequence of delays to be executed
   */
  sequence: DelayNode[];
  /**
   * Whether we're waiting for the next node to be typed.
   */
  isWaiting: boolean;
}

/**
 * A configuration for the timing of typing a text.
 */
interface TypeConfig {
  /**
   * The delay of typing characters
   */
  typeDelay: DelayConfig;
  /**
   * The delay for realizing a mistake (the delay before a mistaken character is deleted)
   */
  mistakeRealizeDelay: DelayConfig;
  /**
   * The probability that the a given character will be mistyped.
   */
  mistakeProbability: number;
}

export const DEFAULT_TYPE_CONFIG: TypeConfig = {
  typeDelay: {
    base: 100,
    variance: 50,
  },
  mistakeRealizeDelay: {
    base: 250,
    variance: 50,
  },
  mistakeProbability: 0.02,
};

/**
 * Type the provided text according to the type config.
 */
type TypeTextAction = Action<
  "TYPE_TEXT",
  { text: string; typeConfig: TypeConfig; listener?: () => void }
>;
/**
 * Delete all characters
 */
type DeleteAllAction = Action<"DELETE_ALL", null>;
/**
 * Indicate that we are waiting to for the next node's delay to finish.
 * Don't pull anything off the stack.
 */
type WaitForNextNodeAction = Action<"WAIT_FOR_NEXT_NODE", null>;
/**
 * Set the current value to the value of the next node.
 */
type TypeNode = Action<"TYPE_NODE", null>;

const reducer = (
  state: State,
  action: TypeTextAction | DeleteAllAction | WaitForNextNodeAction | TypeNode
): State => {
  switch (action.type) {
    case "TYPE_TEXT":
      let textToType = "";
      if (state.sequence.length) {
        // Get the value of the text once the sequence is completed.
        // We should add the text provided to this text.
        textToType = state.sequence[state.sequence.length - 1].text;
      }
      const typeSequence: DelayNode[] = [];
      // Function for generating a the delay of typing a character.
      const getTypeDelay = () =>
        action.payload.typeConfig.typeDelay.base +
        Math.random() * action.payload.typeConfig.typeDelay.variance;

      // Function for generating the delay of realizing a mistake.
      const getMistakeDelay = () =>
        action.payload.typeConfig.mistakeRealizeDelay.base +
        Math.random() * action.payload.typeConfig.mistakeRealizeDelay.variance;

      // For each character...
      action.payload.text.split("").forEach((char, i) => {
        // Possibly make a mistake
        if (Math.random() <= action.payload.typeConfig.mistakeProbability) {
          //Type mistake character
          typeSequence.push({
            text: textToType + TypeWriterService.getMistakeCharacter(char),
            delay: getTypeDelay(),
          });
          // Then erase it.
          typeSequence.push({
            text: textToType,
            delay: getMistakeDelay(),
          });
        }
        // The next text should include the next character
        textToType += char;
        // If this is the last node to add, add the listener to the node.
        if (i === action.payload.text.length - 1 && action.payload.listener) {
          typeSequence.push({
            text: textToType,
            delay: getTypeDelay(),
            listener: action.payload.listener,
          });
        } else {
          typeSequence.push({ text: textToType, delay: getTypeDelay() });
        }
      });
      return { ...state, sequence: state.sequence.concat(typeSequence) };

    case "DELETE_ALL":
      //Immediately delete all characters.
      const newSequence: DelayNode[] = state.currentValue
        .split("")
        // I.E. "123" -> ["123", "12", "1", ""]
        .reduce((sum, char) => [sum[0] + char].concat(sum), [""])
        // Deletes take 10 miliseconds (this value is not configurable yet.)
        .map(text => ({ text, delay: 10 }));
      return {
        ...state,
        sequence: newSequence,
      };

    case "WAIT_FOR_NEXT_NODE":
      return { ...state, isWaiting: true };

    case "TYPE_NODE":
      return {
        currentValue: state.sequence[0].text,
        sequence: state.sequence.slice(1),
        isWaiting: false,
      };

    default:
      return state;
  }
};

interface TypeNextTextConfig {
  /**
   * Listener to be called when this text is finished typing
   * *Note this listener may never be called as the text could be deleted before it is fully typed*
   */
  listener?: () => void;
  /**
   * Config for the timing of typing the text.
   */
  typeConfig?: TypeConfig;
}

type useTypeWriterReturn = [
  /**
   * The value of the text
   */
  string,
  /**
   * A method to set the next text value, with a config.
   */
  (newText: string, config?: TypeNextTextConfig) => void,
  /**
   * Whether the typewriter is idle.
   */
  boolean
];

/**
 * Types some characters.  It's pretty sick.
 *
 * @param initialText - the value of text will start with this value
 * @returns [currentValueOfText, setText, isIdle]
 */
const useTypeWriter = (initialText: string = ""): useTypeWriterReturn => {
  const [state, dispatch] = React.useReducer(reducer, {
    currentValue: initialText,
    sequence: [],
    isWaiting: false,
  });
  const nextNodeTimeout = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (state.isWaiting || !state.sequence.length) {
      return;
    }
    const nextNode = state.sequence[0];
    dispatch({ type: "WAIT_FOR_NEXT_NODE", payload: null });
    nextNodeTimeout.current = setTimeout(() => {
      dispatch({ type: "TYPE_NODE", payload: null });
      if (nextNode.listener) {
        nextNode.listener();
      }
    }, nextNode.delay);
  }, [state]);

  React.useEffect(
    () => () => {
      nextNodeTimeout.current !== null && clearTimeout(nextNodeTimeout.current);
    },
    []
  );

  /**
   * Use ref so this function can be used in effects and won't cause
   * the effect to rerun after state changes.
   */
  const typeNextText = React.useRef(
    (nextText: string, config?: TypeNextTextConfig) => {
      dispatch({ type: "DELETE_ALL", payload: null });
      const typeTextPayload = {
        //If config has a listener or other values, include them.
        ...config,
        //If a config.typeConfig is provided set it to the type config, otherwise use the default
        typeConfig: (config && config.typeConfig) || DEFAULT_TYPE_CONFIG,
        text: nextText,
      };
      dispatch({
        type: "TYPE_TEXT",
        payload: typeTextPayload,
      });
    }
  );

  return [
    state.currentValue,
    typeNextText.current,
    state.sequence.length === 0,
  ];
};

export default useTypeWriter;
