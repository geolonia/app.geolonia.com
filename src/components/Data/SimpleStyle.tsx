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

const textColor = '#000000'
const textHaloColor = '#FFFFFF'
const backgroundColor = 'rgba(255, 0, 0, 0.4)'
const strokeColor = '#FFFFFF'

const SimpleStyle: {
  [key: string]: StyleSpec;
} = {
  "Point": {
    "text-color": {
      "label": __("Text Color"),
      "type": "color",
      "default": textColor
    },
    "text-halo-color": {
      "label": __("Text Halo Color"),
      "type": "hide",
      "default": textHaloColor
    },
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
      "label": __("Background"),
      "type": "color",
      "default": backgroundColor
    },
    "stroke": {
      "label": __("Stroke"),
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
    "text-color": {
      "label": __("Text Color"),
      "type": "color",
      "default": textColor
    },
    "text-halo-color": {
      "label": __("Text Halo Color"),
      "type": "hide",
      "default": textHaloColor
    },
    "stroke": {
      "label": __("Stroke"),
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
    "text-color": {
      "label": __("Text Color"),
      "type": "color",
      "default": textColor
    },
    "text-halo-color": {
      "label": __("Text Halo Color"),
      "type": "hide",
      "default": textHaloColor
    },
    "fill": {
      "label": __("Background"),
      "type": "color",
      "default": backgroundColor
    },
    "stroke": {
      "label": __("Stroke"),
      "type": "color",
      "default": strokeColor
    }
  }
}

SimpleStyle.MultiPoint = SimpleStyle.Point
SimpleStyle.MultiLineString = SimpleStyle.LineString
SimpleStyle.MultiPolygon = SimpleStyle.Polygon

export default SimpleStyle;
