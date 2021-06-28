# app.geolonia.com

[![Node.js CI](https://github.com/geolonia/app.geolonia.com/actions/workflows/node.js.yml/badge.svg)](https://github.com/geolonia/app.geolonia.com/actions/workflows/node.js.yml)

![Netlify Status](https://api.netlify.com/api/v1/badges/82532c8e-8d86-4215-a8f7-9fca30cfb132/deploy-status)

## development

```shell
$ git clone git@github.com:geolonia/app.geolonia.com.git
$ cd app.geolonia.com
$ yarn
$ cp .env.development.sample .env.development
$ vi .env.development
$ yarn start
```

http://localhost:3000/ で開発用環境が立ち上がります。

開発環境では本番と別のデータベースを使用しています。ダッシュボードにログインするためには http://localhost:3000/?lang=ja#/signup から新しくユーザーを作成して下さい。

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

const mapStateToProps = (state: Geolonia.Redux.AppState) => {
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

## i18n

Make pot:

```
$ npm run i18n
```

Translate `ja.po` and run following.

```
$ npm run po2json
```
