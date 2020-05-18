import React from "react";

import './IconSelector.scss'
import { SpritesEndpoint } from '../../constants'

type Props = {
  name: string;
  Icon: string;
  updateIconHandler: Function;
};

type iconObject = {
  height: number;
  width: number;
  pixelRatio: number;
  x: number;
  y: number;
}

type iconsObject = {
  [key: string]: iconObject
}

const Content = (props: Props) => {
  const [Icons, setIcons] = React.useState<iconsObject>({})

  React.useEffect(() => {
    fetch(SpritesEndpoint)
      .then(res => res.json())
      .then(json => {
        const icons = {} as iconsObject
        for (const key in json) {
          if (key.match(/-15$/)) {
            icons[key] = json[key]
          }
        }
        setIcons(icons)
      });
  }, [])

  const onUpdateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Nothing to do.
  }

  const onFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const popup = document.createElement('div')
    popup.id = 'icon-popup'
    document.body.appendChild(popup)
    popup.onclick = () => {
      document.body.removeChild(popup)
    }

    const popupContainer = document.createElement('div')
    popupContainer.className = 'popup-container'
    for (let i = 0; i < Object.keys(Icons).length; i++) {
      const iconName = Object.keys(Icons)[i]
      const iconObject = Icons[iconName]
      const iconContainer = document.createElement('div')
      iconContainer.className = 'icon-container'
      const img = document.createElement('img')
      img.src = 'https://sprites.geolonia.com/basic.png'
      img.style.objectPosition = `${0 - iconObject.x}px ${0 - iconObject.y}px`
      iconContainer.appendChild(img)
      iconContainer.dataset.name = img.dataset.name = iconName.replace(/-15$/, '')
      iconContainer.addEventListener('mouseover', (event) => {
        if (event.target) {
          (event.target as HTMLDivElement).style.backgroundColor = '#eeeeee'
        }
      })
      iconContainer.addEventListener('mouseleave', (event: MouseEvent) => {
        if (event.target) {
          (event.target as HTMLDivElement).style.backgroundColor = '#ffffff'
        }
      })
      iconContainer.addEventListener('click', (event: MouseEvent) => {
        props.updateIconHandler(props.name, (event.target as HTMLDivElement).dataset.name)
      })
      popupContainer.appendChild(iconContainer)
    }

    const button = document.createElement('button')
    button.textContent = 'Clear'
    button.addEventListener('click', (event: MouseEvent) => {
      props.updateIconHandler(props.name, "")
    })
    popupContainer.appendChild(button)

    popup.appendChild(popupContainer)
  }

  return (
    <div className="icon-selector">
      <input type="text" name={props.name} value={props.Icon} onFocus={onFocusHandler} onChange={onUpdateHandler} />
    </div>
  );
};

export default Content;
