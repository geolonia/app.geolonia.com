import { connect } from "react-redux";
import { AppState } from "./store";
import Redux from "redux";

export const REDUXIFY = "UTIL/REDIXFY";

export type ReduxifyAction = {
  type: typeof REDUXIFY;
  payload: {
    key: keyof AppState;
    state: any;
  };
};

type StateProps = { appState: AppState };
type DispatchProps = {
  dispatch: Redux.Dispatch;
  setAppState: (nextAppState: Partial<AppState>) => void;
};

export type ReduxifyProps = StateProps & DispatchProps;

const isReduxifyAction = (action: Redux.AnyAction): action is ReduxifyAction =>
  action.type === REDUXIFY && action.payload && !!action.payload.state;

export const appendReduxifyReducers: Redux.Reducer = (
  reducerMapObjects: Redux.ReducersMapObject
) => {
  const result: Redux.ReducersMapObject = {};

  for (let key in reducerMapObjects) {
    // Proxy all reducer composition
    result[key] = (state: any, action: Redux.AnyAction) => {
      const nextState = reducerMapObjects[key](state, action);

      if (isReduxifyAction(action) && key === action.payload.key) {
        return action.payload.state;
      } else {
        return nextState;
      }
    };
  }
  return result;
};

const reduxify = (MyComponent: any) => {
  const mapStateToProps = (appState: AppState): StateProps => {
    return { appState };
  };
  const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => {
    return {
      dispatch,
      setAppState: (nextAppState: Partial<AppState>) => {
        (Object.keys(nextAppState) as (keyof AppState)[]).forEach(key => {
          const state = nextAppState[key];
          if (state) {
            dispatch({
              type: REDUXIFY,
              payload: { key, state }
            });
          }
        });
      }
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyComponent);
};

export default reduxify;
