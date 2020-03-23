interface Spec {
  [key: string]: string | string[]
}

interface StyleSpec {
  [key: string]: Spec;
}

interface SimpleStyle {
  [key: string]: StyleSpec;
}

const SimpleStyle: SimpleStyle = {
  "Point": {
    "marker-size": {
      "label": "Size",
      "type": "option",
      "values": [
        "small",
        "medium",
        "large"
      ]
    },
    "marker-color": {
      "label": "Color",
      "type": "color"
    },
    "stroke": {
      "label": "Stroke",
      "type": "color"
    },
    "stroke-width": {
      "label": "Stroke Width",
      "type": "number"
    }
  },
  "LineString": {
    "stroke": {
      "label": "Stroke",
      "type": "color"
    },
    "stroke-width": {
      "label": "Stroke Width",
      "type": "number"
    }
  },
  "Polygon": {
    "fill-color": {
      "label": "Color",
      "type": "color"
    },
    "stroke": {
      "label": "Stroke",
      "type": "color"
    }
  }
}

export default SimpleStyle;
