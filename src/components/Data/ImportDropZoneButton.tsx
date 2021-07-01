import React from "react"
import ImportDropZone from "./ImportDropZone"
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { __ } from "@wordpress/i18n"
import "./ImportDropZoneButton.scss"

type Props = {
  setTileStatus: Function,
  session: Geolonia.Session,
  isPaidTeam: boolean,
  teamId?: string,
  geojsonId?: string,
}

const styleOuterDefault: React.CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  zIndex: 9999,
  display: 'none',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'left',
}

const Content = (props: Props) => {
  const [stateImporter, setStateImporter] = React.useState<boolean>(false)
  const [styleOuter, setStyleOuter] = React.useState<React.CSSProperties>(styleOuterDefault)

  React.useEffect(() => {
    const style = {...styleOuterDefault}
    if (stateImporter) {
      style.display = 'flex'
    } else {
      style.display = 'none'
    }
    setStyleOuter(style)
  }, [stateImporter])

  const close = () => {
    setStateImporter(false)
  }

  const preventClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <>
      <button className="btn" onClick={() => setStateImporter(true)}><CloudUploadIcon fontSize="small" /><span className="label">{__("Import GeoJSON")}</span></button>
      {stateImporter ? (
        <div className="geojson-importer geojson-dropzone-button" style={styleOuter} onClick={close}>
          <div className="inner" onClick={preventClose}>
            <ImportDropZone
              session={props.session}
              teamId={props.teamId}
              geojsonId={props.geojsonId}
              isPaidTeam={props.isPaidTeam}
              setTileStatus={props.setTileStatus}
            />
          </div>
        </div>
      ) : (
      <></>
      )}
    </>
  );
};

export default Content;
