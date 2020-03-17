# app.geolonia.com

| `master`-v1 (app.geolonia.com)                                                                                                                                    | `feature`-dev (dev.app.geolonia.com)                                                                       |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| [![Netlify Status](https://api.netlify.com/api/v1/badges/82532c8e-8d86-4215-a8f7-9fca30cfb132/deploy-status)](https://app.netlify.com/sites/geolonia-app/deploys) | ![Node.js CI](https://github.com/geolonia/app.geolonia.com/workflows/Node.js%20CI/badge.svg?branch=master) |

## development

```shell
$ git clone git@github.com:geolonia/app.geolonia.com.git
$ cd app.geolonia.com
$ npm install
$ cp .env.development.sample .env.development
$ vi .env.development
$ npm start
```

## Component Template

### Simple

```tsx
// hello.tsx
import React from "react";
import "./hello.scss";

type Props = {
  name: string;
};

export class HelloComponent extends React.Component<Props> {
  render() {
    const name = this.props.name;
    const text = "Hello, " + name + "!";
    return <h1 className="hello">{text}</h1>;
  }
}

export default HelloComponent;
```

```tsx
// hello.test.tsx
import React from "react";
import ReactDOM from "react-dom";
import MySample from "./my-sample";

it("renders text", () => {
  const div = document.createElement("div");
  // @ts-ignore
  ReactDOM.render(<MySample name="Geolonia" />, div);
  expect(div.innerHTML).toEqual('<h1 class="hello">Hello, Geolonia!</h1>');

  ReactDOM.unmountComponentAtNode(div);
});
```

```css
// hello.scss

.hello {
  font-weight: bold;
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
