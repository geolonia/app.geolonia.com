import { connect } from "react-redux";
import { AppState } from "./store";
import Redux from "redux";
import { reducer } from "./actions/user-meta";

type AppStateCompositionKey = keyof AppState;
type ReduxifySetStateParam = { [key in AppStateCompositionKey]: any };

export const GLOBAL_UTIL_ACTION_TYPE = "UTIL/REDIXFY";
export type GLOBAL_UTIL_ACITON = {
  type: typeof GLOBAL_UTIL_ACTION_TYPE;
  payload: { key: string; nextLocalState: any };
};

export const appendReduxifyReducers: Redux.Reducer = (
  reducerMapObjects: Redux.ReducersMapObject
) => {
  const result: Redux.ReducersMapObject = {};
  for (let key in reducerMapObjects) {
    result[key] = (state: any, action: Redux.AnyAction) => {
      const nextState = reducerMapObjects[key](state, action);

      if (
        action.type === GLOBAL_UTIL_ACTION_TYPE &&
        key === action.payload.key &&
        action.payload.nextLocalState
      ) {
        return action.payload.nextLocalState;
      } else {
        return nextState;
      }
    };
  }
  return result;
};

const reduxify = (MyComponent: any) => {
  const mapStateToProps = (appState: AppState) => {
    return { appState };
  };
  const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
    return {
      dispatch,
      setAppState: (param: ReduxifySetStateParam) => {
        (Object.keys(param) as AppStateCompositionKey[]).forEach(key => {
          param[key] &&
            dispatch({
              type: GLOBAL_UTIL_ACTION_TYPE,
              payload: { key, nextLocalState: param[key] }
            });
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
