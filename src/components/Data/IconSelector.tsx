import React from "react";

import { SpritesEndpoint } from '../../constants'

type Props = {
  name: string;
  Icon: string;
  updatePropSelectHandler: Function;
};

const style = {
  width: '100%',
}

type itemsHash = {
  [key: string]: boolean
}

const Content = (props: Props) => {
  const [Icons, setIcons] = React.useState<string[]>([])

  React.useEffect(() => {
    fetch(SpritesEndpoint)
      .then(res => res.json())
      .then(json => {
        const items = {} as itemsHash
        for (let i = 0; i < Object.keys(json).length; i++) {
          const item = Object.keys(json)[i]
          if (item.match(/-15$/)) {
            items[item.replace(/-15$/, '')] = true
          }
        }
        setIcons(Object.keys(items).sort())
      });
  }, [])

  return (
    <>
      <select name={props.name} style={style} value={props.Icon}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => props.updatePropSelectHandler(event)}>
        <option value=""></option>
        {Icons.map((icon, index) => {
          return(<option key={index} value={icon}>{icon}</option>)
        })}
      </select>
    </>
  );
};

export default Content;
