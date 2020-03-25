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
      "default": "#7e7e7e"
    },
    "stroke": {
      "label": __("Stroke Color"),
      "type": "color",
      "default": "#555555"
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
      "default": "#555555"
    },
    "stroke-width": {
      "label": __("Stroke Width"),
      "type": "number",
      "default": 1
    }
  },
  "Polygon": {
    "fill": {
      "label": __("Background Color"),
      "type": "color",
      "default": "#7e7e7e"
    },
    "stroke": {
      "label": __("Stroke Color"),
      "type": "color",
      "default": "#555555"
    }
  }
}

export default SimpleStyle;
