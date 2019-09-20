# app.geolonia.com

## Component Template

```typescript
type State = {
  value: number
}

type Props = {
  name: string
}

class MyComponent extends React.Component<State, Props> {

  state = {
    value: 123,
  }

  static defaultProps = {
    name: 'hello'
  }

  render() {
    const state = this.state
    const props = this.props
    return <div></div>
  }
}
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
