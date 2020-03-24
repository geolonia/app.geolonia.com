import { __ } from "@wordpress/i18n";

interface Spec {
  label: string;
  type: string;
  values?: string[]
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
      "label": __("Size"),
      "type": "option",
      "values": [
        "small",
        "medium",
        "large"
      ]
    },
    "marker-symbol": {
      "label": __("Symbol"),
      "type": "symbol"
    },
    "marker-color": {
      "label": __("Color"),
      "type": "color"
    },
    "stroke": {
      "label": __("Stroke"),
      "type": "color"
    },
    "stroke-width": {
      "label": __("Stroke Width"),
      "type": "number"
    }
  },
  "LineString": {
    "stroke": {
      "label": __("Stroke"),
      "type": "color"
    },
    "stroke-width": {
      "label": __("Stroke Width"),
      "type": "number"
    }
  },
  "Polygon": {
    "fill-color": {
      "label": __("Color"),
      "type": "color"
    },
    "stroke": {
      "label": __("Stroke"),
      "type": "color"
    }
  }
}

export default SimpleStyle;
