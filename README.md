# app.geolonia.com

[![Node.js CI](https://github.com/geolonia/app.geolonia.com/actions/workflows/node.js.yml/badge.svg)](https://github.com/geolonia/app.geolonia.com/actions/workflows/node.js.yml)

![Netlify Status](https://api.netlify.com/api/v1/badges/82532c8e-8d86-4215-a8f7-9fca30cfb132/deploy-status)

## ブランチ運用ルール（重要）

- このリポジトリの default branch は `develop` です。GitHub の organization rule (branch protection) が保護しているのはこの `develop` のみで、production 環境が参照する `master` は保護対象外です（このリポジトリに `main` ブランチは存在しません）。
- ただし `master` が組織ルールで保護されていない場合であっても、`develop` を経由せず `master` へ直接変更を加えることは禁止です。
- `master` への直接変更は、staging 環境での動作確認をスキップして production 環境へ変更を適用することを意味するため、原則として許可されません。
- production 環境（`master`）が staging 環境（`develop`）よりも進んでいる（内容が乖離している）状態を発生させてはいけません。
- PR は必ず `develop` を経由して `master` に取り込んでください。feature/fix ブランチは `develop` から作成し、`develop` を base に PR を作成してください。
- PR の base branch を `master` に向けてはいけません。

## development

```shell
$ git clone git@github.com:geolonia/app.geolonia.com.git
$ cd app.geolonia.com
$ yarn
$ cp .env.development.example .env.development
$ vi .env.development
$ yarn start
```

.env.development には、app.geolonia.com が利用している外部サービスのトークン等を入れる必要があります。
Geolonia 社員は[こちら](https://geolonia.esa.io/posts/1092)を参考に環境変数の値を定義して下さい。

`yarn start` を実行すると http://localhost:3000/ で開発用環境が立ち上がります。

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

Make pot and merge existing po file(s):

```shell
$ yarn i18n
```

Translate `ja.po` and run following.

```shell
$ yarn po2json
```

Perform a simple check to make sure that all text has been translated.

```shell
$ yarn validate:jed
```
