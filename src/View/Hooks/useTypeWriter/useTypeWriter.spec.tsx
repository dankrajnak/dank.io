import {
  reducer,
  State,
  DeleteAllAction,
  TypeTextAction,
  DEFAULT_TYPE_CONFIG,
  WaitForNextNodeAction,
} from "./useTypeWriter";
import React from "react";
import { mount } from "enzyme";

const createState = (text: string = ""): State => ({
  isWaiting: false,
  sequence: [],
  currentValue: text,
});

// **************** Reducer Tests ****************

test("Reducer returns state with invalid action", () => {
  const initialState: State = createState();
  const invalidAction = { type: "INVALID_ACTION", payload: "bad payload" };

  // @ts-ignore
  expect(reducer(initialState, invalidAction)).toBe(initialState);
});

test("Reducer deletes all characters with DELETE_ALL action", () => {
  const testText = "Test";
  const initialState: State = createState(testText);

  const deleteAction: DeleteAllAction = { type: "DELETE_ALL", payload: null };
  const sequenceAfterDelete = reducer(initialState, deleteAction).sequence;

  expect(sequenceAfterDelete.length).toBe(testText.length);

  expect(sequenceAfterDelete.map(node => node.text)).toStrictEqual([
    "Tes",
    "Te",
    "T",
    "",
  ]);
});

test("DELETE_ACTION doesn't do anything when current value is empty", () => {
  const initialState: State = createState();

  const deleteAction: DeleteAllAction = { type: "DELETE_ALL", payload: null };
  const sequenceAfterDelete = reducer(initialState, deleteAction).sequence;

  expect(sequenceAfterDelete).toStrictEqual([]);
});

test("Listener present on last node in type action", () => {
  const initialState: State = createState();
  const testText = "Test";
  const listener = () => {};

  const deleteAction: TypeTextAction = {
    type: "TYPE_TEXT",
    payload: { text: testText, typeConfig: DEFAULT_TYPE_CONFIG, listener },
  };
  const sequenceAfterType = reducer(initialState, deleteAction).sequence;

  expect(sequenceAfterType[sequenceAfterType.length - 1].listener).toEqual(
    listener
  );
});

test("Listener present on last node in type action when setting empty text", () => {
  const initialState: State = createState("Test");
  const listener = () => {};

  const deleteAction: TypeTextAction = {
    type: "TYPE_TEXT",
    payload: { text: "", typeConfig: DEFAULT_TYPE_CONFIG, listener },
  };
  const sequenceAfterType = reducer(initialState, deleteAction).sequence;

  expect(sequenceAfterType[sequenceAfterType.length - 1].listener).toEqual(
    listener
  );
});

test("Is waiting action sets isWaiting flag", () => {
  const initialState: State = createState();

  const deleteAction: WaitForNextNodeAction = {
    type: "WAIT_FOR_NEXT_NODE",
    payload: null,
  };

  expect(reducer(initialState, deleteAction).isWaiting).toBeTruthy();
});

// **************** Hook Tests ****************

const DummyHookComponent = ({ textToType }: { textToType: string }) => {
  const [typedText, setText] = React.useState("");
  React.useEffect(() => {
    setText(textToType);
  }, [setText, textToType]);
  return <div>{typedText}</div>;
};

test("It eventually types some text", () => {
  jest.useFakeTimers();
  const testText = "Test!";
  const component = mount(<DummyHookComponent textToType={testText} />);
  setTimeout(() => {
    expect(component.contains(testText)).toBeTruthy();
  }, 10000);
  jest.runAllTimers();
});
