import * as React from "react";
import Action from "../../Domain/Action/Action";

// This is something I kinda wrote for Aviso (on the weekend).
// Keeping it here in case there's some reason I need it.

interface State<T> {
  isLoading: boolean;
  data: T | null;
  wasSuccessful: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

const getErrorMessage = (error: unknown): string | null => {
  if (typeof error === "string") {
    return error;
  }
  return null;
};

type StartFetchAction = Action<"START_FETCH", null>;
type GotDataAction<T> = Action<"GOT_DATA", T>;
type ErrorAction = Action<"ERROR", string | null>;

type ReducerType<T = unknown> = (
  state: State<T>,
  action: StartFetchAction | GotDataAction<T> | ErrorAction
) => State<T>;

const reducer: ReducerType = <T>(
  state: State<T>,
  action: StartFetchAction | GotDataAction<T> | ErrorAction
) => {
  switch (action.type) {
    case "START_FETCH":
      return {
        ...state,
        isLoading: true,
        wasSuccessful: false,
        hasError: false,
        errorMessage: null,
      };
    case "GOT_DATA": {
      return {
        isLoading: false,
        wasSuccessful: true,
        hasError: false,
        errorMessage: null,
        data: action.payload,
      };
    }
    case "ERROR": {
      return {
        ...state,
        isLoading: false,
        wasSuccessful: false,
        hasError: true,
        errorMessage: action.payload,
      };
    }
    default:
      return state;
  }
};

const useService = <T>(
  servicePromise: Promise<T>,
  initialData: T | null = null
): State<T> => {
  const initialState: State<T> = {
    isLoading: false,
    data: initialData,
    wasSuccessful: false,
    hasError: false,
    errorMessage: null,
  };
  const [state, dispatch] = React.useReducer(
    reducer as ReducerType<T>,
    initialState
  );
  React.useEffect(() => {
    dispatch({ type: "START_FETCH", payload: null });
    servicePromise
      .then(data => {
        dispatch({ type: "GOT_DATA", payload: data });
      })
      .catch(error => {
        dispatch({ type: "ERROR", payload: getErrorMessage(error) });
      });
  }, [servicePromise]);

  return state;
};

export default useService;
