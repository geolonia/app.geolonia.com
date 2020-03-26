import { __ } from "@wordpress/i18n";

interface Spec {
  label: string;
  type: string;
  values?: string[];
  default: string | number;
}

interface StyleSpec {
  [key: string]: Spec;
}

interface SimpleStyle {
  [key: string]: StyleSpec;
}

const backgroundColor = 'rgba(255, 0, 0, 0.4)'
const strokeColor = '#FFFFFF'

const SimpleStyle: SimpleStyle = {
  "Point": {
    "marker-size": {
      "label": __("Size"),
      "type": "option",
      "values": [
        "small",
        "medium",
        "large"
      ],
      "default": 'medium'
    },
    "marker-symbol": {
      "label": __("Symbol"),
      "type": "symbol",
      "default": ""
    },
    "marker-color": {
      "label": __("Background Color"),
      "type": "color",
      "default": backgroundColor
    },
    "stroke": {
      "label": __("Stroke Color"),
      "type": "color",
      "default": strokeColor
    },
    "stroke-width": {
      "label": __("Stroke Width"),
      "type": "number",
      "default": 1
    }
  },
  "LineString": {
    "stroke": {
      "label": __("Stroke Color"),
      "type": "color",
      "default": backgroundColor
    },
    "stroke-width": {
      "label": __("Stroke Width"),
      "type": "number",
      "default": 2
    }
  },
  "Polygon": {
    "fill": {
      "label": __("Background Color"),
      "type": "color",
      "default": backgroundColor
    },
    "stroke": {
      "label": __("Stroke Color"),
      "type": "color",
      "default": strokeColor
    }
  }
}

export default SimpleStyle;
