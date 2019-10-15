# app.geolonia.com

## Component Template

### Without Redux

```typescript
import React from "react";
import { connect } from "react-redux";

type Props = {
  name: string;
};

type State = {
  value: number;
};

export default class MyComponent extends React.Component<Props, State> {
  state = {
    value: 123
  };

  static defaultProps = {
    name: "hello"
  };

  render() {
    const state = this.state;
    const props = this.props;
    return <div></div>;
  }
}
```

### With Redux

```tsx
import React from "react";

type Props = {
  // ownProps
  ownValue: string;
  // stateProps
  appValue: string;
  // dispatchProps
  handler: () => void;
};

export class MyComponent extends React.Component<Props> {
  render() {
    const { ownValue, appValue, handler } = this.props;
    ...
    return ...
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    appValue: state.app.value,
  }
}

const mapDispatchToProps = (Dispatch: Redux.dispatch) => {
  return {
    handler: () => {
      const action: { type: string, payload: any } = {
        type: 'src/redux/actions で定義する state 更新のタイプ',
        payload: { /* 更新パラメータ */ }
      }
      dispatch(action)
    }
  }
}

// DI
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

```tsx
import ReactDOM from "react-dom";
import MyComponent from "path/to/my-component";
ReactDOM.render(<MyComponent ownValue={"hello"} />);
```

### The alternative

Sample to use `reduxify` container and simplify the connection between the global Redux store and local components

```typescript
import reduxify, { ReduxifyProps } from "src/redux/reduxify";

type OwnProps = {};
type Props = OwnProps & ReduxifyProps;

export class MyComponent extends React.Component {
  render() {
    const { appState, setAppState } = this.props;
    // appState: AppState
    // setAppState: (nextState: Partial<AppState>) => void
    return <>{/* ... */}</>;
  }
}

const ConnetctedMyComponent = reduxify(MyComponent);
export default ConnectedMyComponent;
```

## i18n

Make pot:

```
$ npm run i18n
```

Translate `ja.po` and run following.

```
$ npm run po2json
```
