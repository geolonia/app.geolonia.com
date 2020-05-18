const fullscreenIcon = "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E%3Cpath d='M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z'/%3E%3C/svg%3E\")"
const exitFullscreenIcon = "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z'/%3E%3C/svg%3E\")"

export default class FullScreenMap {
  map: mapboxgl.Map | undefined;
  container: HTMLElement | undefined;
  targetSelector: string;

  constructor(targetSelector: string) {
    this.targetSelector = targetSelector
    this.map = undefined
  }

  onAdd(map: mapboxgl.Map) {
    this.map = map
    const btn = document.createElement('button')
    btn.className = 'mapboxgl-ctrl-fullscreen material-icons'
    btn.style.cursor = 'pointer'
    btn.type = "button"

    const span = document.createElement('span')
    span.className = 'mapboxgl-ctrl-icon'
    span.style.backgroundImage = fullscreenIcon

    btn.addEventListener("click", () => {
      const target = document.querySelector(this.targetSelector)
      if (target) {
        if (target.classList.contains('full-screen')) {
          target.classList.remove('full-screen')
          span.style.backgroundImage = fullscreenIcon
          map.resize()
        } else {
          target.classList.add('full-screen')
          span.style.backgroundImage = exitFullscreenIcon
          map.resize()
        }
      }
    })

    btn.appendChild(span)

    this.container = document.createElement('div')
    this.container.appendChild(btn)
    this.container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl'

    return this.container
  }

  onRemove() {
    if (this.container && this.container.parentNode && this.map) {
      this.container.parentNode.removeChild(this.container)
      this.map = undefined;
    }
  }
}
