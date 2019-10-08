import React from "react";
import reduxify from "../../redux/reduxify";

export const Sample = (props: any) => {
  const [name, setName] = React.useState("");
  const propName = props.state.userMeta.name;
  React.useEffect(() => setName(propName), [propName]);

  const onUpdateClick = () => {
    props.setState({ userMeta: { ...props.state.userMeta, name } });
  };

  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={onUpdateClick}>{"ReduxのStateにある名前を更新"}</button>
    </div>
  );
};

export default reduxify(Sample);
