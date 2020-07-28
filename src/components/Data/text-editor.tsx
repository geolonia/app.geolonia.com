import React from "react";
import styled from "styled-components";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  setGeoJSON: (geojson: Props["geoJSON"]) => void;
};

type StyledProps = {
  error: boolean;
};

const TextArea = styled.textarea<StyledProps>`
  width: 100%;
  height: 100%;
  ${props => (props.error ? "border: 1px solid red" : "")}
`;

export const TextEditor = (props: Props) => {
  const { geoJSON, setGeoJSON } = props;
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setDraft(JSON.stringify(geoJSON, null, 2));
  }, [geoJSON]);

  return (
    <TextArea
      rows={10}
      value={draft}
      error={error}
      onFocus={() => setError(false)}
      onChange={e => {
        setDraft(e.target.value);
      }}
      onKeyDown={e => {
        if (e.keyCode === 13 && e.altKey) {
          e.currentTarget.blur();
        }
      }}
      onBlur={() => {
        let parsed;
        try {
          parsed = JSON.parse(draft);
        } catch {
          setError(true);
          return;
        }
        setGeoJSON(parsed);
        setDraft(JSON.stringify(parsed, null, 2));
      }}
    />
  );
};

export default TextEditor;
