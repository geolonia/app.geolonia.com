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
