import * as React from "react";
import { Action } from "../../Domain/Action/Action";

const _getMistakeCharacter = (character: string): string => {
  const keyboard = ["qwertyuiop[", "asdfghjkl;", "zxcvbnm,"];
  const uppercase = character.toUpperCase() === character;
  const isLetter =
    "abcdefghijklmnopqrstuvwxyz".indexOf(character.toLowerCase()) !== -1;

  if (isLetter) {
    /*With a 90% chance, if the character is uppercase, make the
      mistake character the lowercase version of the uppercase.
      If it's lowercase, reverse the probability.*/
    const chanceOfCaseMistake = uppercase ? 0.9 : 0.1;
    if (Math.random() <= chanceOfCaseMistake) {
      return uppercase ? character.toLowerCase() : character.toUpperCase();
    }
    //Otherwise make a big finger mistake
    keyboard.forEach(keyRow => {
      const index = keyRow.indexOf(character.toLowerCase());
      if (index !== -1) {
        switch (index) {
          case 0:
            return keyRow[1];

          case keyRow.length - 1:
            return keyRow.length - 2;

          default:
            return Math.random() <= 0.5 ? keyRow[index - 1] : keyRow[index + 1];
        }
      }
    });
  }

  //Handle special characters
  //TODO: this doesn't handle ' ' (space) very well... or at all.
  const specialCharacters = ["1234567890-=", "p[]\\", "l;'", "m,./"];
  const specialCharactersShift = ["!@#$%^&*()_+", "P{}|", 'L:"', "M<>?"];

  for (let i = 0; i < specialCharactersShift.length; i++) {
    const shiftedIndex = specialCharactersShift[i].indexOf(character);
    if (shiftedIndex !== -1) {
      //It's shifted, so with a 90% chance, make a shift mistake.  Otherwise, big finger mistake.
      if (Math.random() <= 0.9) {
        return specialCharacters[i][shiftedIndex];
      }
      switch (shiftedIndex) {
        case 0:
          return specialCharactersShift[i][1];

        case specialCharactersShift[i].length - 1:
          return specialCharactersShift[i][
            specialCharactersShift[i].length - 2
          ];

        default:
          return Math.random() <= 0.5
            ? specialCharactersShift[i][shiftedIndex - 1]
            : specialCharactersShift[i][shiftedIndex + 1];
      }
    }
  }

  for (let i = 0; i < specialCharacters.length; i++) {
    const index = specialCharactersShift[i].indexOf(character);
    if (index !== -1) {
      //It's not shifted, so with a 10% chance, make a shift mistake.  Otherwise, big finger mistake.
      if (Math.random() <= 0.1) {
        return specialCharactersShift[i][index];
      }
      switch (index) {
        case 0:
          return specialCharactersShift[i][1];

        case specialCharactersShift[i].length - 1:
          return specialCharactersShift[i][
            specialCharactersShift[i].length - 2
          ];

        default:
          return Math.random() <= 0.5
            ? specialCharactersShift[i][index - 1]
            : specialCharactersShift[i][index + 1];
      }
    }
  }
  //As a default, just return the given character.
  return character;
};

type TypeCharacterAction = Action<"TYPE_CHARACTER", string>;
type DeleteCharacterAction = Action<"DELETE_CHARACTER", null>;
type MakeMistakeAction = Action<"MAKE_MISTAKE", string>;
type FishedTypingAction = Action<"FINISHED", null>;

interface State {
  text: string;
  finishedTyping: boolean;
}

const reducer = (
  state: State,
  action:
    | TypeCharacterAction
    | DeleteCharacterAction
    | MakeMistakeAction
    | FishedTypingAction
): State => {
  switch (action.type) {
    case "TYPE_CHARACTER":
      return { finishedTyping: false, text: state.text + action.payload };
    case "DELETE_CHARACTER":
      if (state.text.length) {
        return {
          ...state,
          text: state.text.substring(0, state.text.length - 1),
        };
      } else {
        return state;
      }
    case "MAKE_MISTAKE":
      return {
        ...state,
        text: state.text + _getMistakeCharacter(action.payload),
      };
    case "FINISHED":
      return {
        ...state,
        finishedTyping: true,
      };
    default:
      return state;
  }
};

const DEFAULT_TYPE_DELAY_BASE = 150;
const DEFAULT_TYPE_DELAY_VARIANCE = 50;
const DEFAULT_DELETE_DELAY_BASE = 80;
const DEFAULT_DELETE_DELAY_VARIANCE = 10;
const DEFAULT_PAUSE_AMOUNT = 2000;

interface DelaySequenceItem {
  action:
    | TypeCharacterAction
    | DeleteCharacterAction
    | MakeMistakeAction
    | FishedTypingAction;
  delay: number;
}

const useTypeWriter = (
  initialText: string,
  config = {}
): [string, boolean, (newText: string) => void] => {
  const delaySequence = React.useRef<DelaySequenceItem[]>([]);
  const timeout = React.useRef<number | null>(null);
  const [state, dispatch] = React.useReducer(reducer, {
    text: initialText,
    finishedTyping: false,
  });

  const setNewText = React.useRef((newText: string) => {
    let newSequence: DelaySequenceItem[] = [];
    newText.split("").forEach(character => {
      // 10% chance we make a mistake
      if (Math.random() <= 0.1) {
        newSequence.push({
          action: { type: "MAKE_MISTAKE", payload: character },
          delay:
            DEFAULT_TYPE_DELAY_BASE +
            Math.random() * DEFAULT_TYPE_DELAY_VARIANCE,
        });
        newSequence.push({
          action: { type: "DELETE_CHARACTER", payload: null },
          delay:
            DEFAULT_DELETE_DELAY_BASE +
            Math.random() * DEFAULT_DELETE_DELAY_VARIANCE,
        });
      }
      newSequence.push({
        action: { type: "TYPE_CHARACTER", payload: character },
        delay:
          DEFAULT_TYPE_DELAY_BASE + Math.random() * DEFAULT_TYPE_DELAY_VARIANCE,
      });
    });
    newSequence = newSequence.concat(
      newText.split("").map((_character, index) => ({
        action: { type: "DELETE_CHARACTER", payload: null },
        delay:
          index === 0
            ? DEFAULT_PAUSE_AMOUNT
            : DEFAULT_DELETE_DELAY_BASE +
              Math.random() * DEFAULT_DELETE_DELAY_VARIANCE,
      }))
    );
    newSequence.push({
      action: { type: "FINISHED", payload: null },
      delay: 0,
    });

    delaySequence.current = newSequence;

    const play = () => {
      if (delaySequence.current.length) {
        const next = delaySequence.current.shift();
        if (next) {
          timeout.current = setTimeout(() => {
            dispatch(next.action);
            play();
          }, next.delay);
        }
      }
    };
    play();
  });

  React.useEffect(
    () => () => {
      timeout.current && clearTimeout(timeout.current);
    },
    []
  );

  return [state.text, state.finishedTyping, setNewText.current];
};

export default useTypeWriter;
