import React from "react";
import reduxify, { ReduxifyProps } from "../../redux/reduxify";

type OwnProps = {};
type Props = OwnProps & ReduxifyProps;

export const Sample = (props: Props) => {
  const [name, setName] = React.useState("");
  const propName = props.appState.userMeta.name;
  React.useEffect(() => setName(propName), [propName]);

  const onUpdateClick = () => {
    props.setAppState({ userMeta: { ...props.appState.userMeta, name } });
  };

  console.log(props.appState);

  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={onUpdateClick}>{"ReduxのStateにある名前を更新"}</button>
    </div>
  );
};

export default reduxify(Sample);
