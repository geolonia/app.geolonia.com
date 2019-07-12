import React, { useState } from "react";
import PropTypes from "prop-types";
import Spinner from "./spinner";

const Modal = props => {
  console.log(props.open)

  if (!props.open) {
    return null
  }


  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [allowedOrigins, setAllowedOrigins] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(false);

  const requestUpdate = async () => {
    setRequesting(true);
    let initialData;
    const updateProps = {
      name,
      enabled,
      allowedOrigins: allowedOrigins.split("\n")
    };
    try {
      initialData = await props.auth.API.createKey();
      console.log(updateProps);
      await props.auth.API.updateKey(initialData.userKey, updateProps);
      props.onMapCreated({ ...initialData, ...updateProps });
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setRequesting(false);
    props.close()
  };

  return (
    <div className={"uk-flex-top uk-modal uk-flex uk-open"} uk-modal={"true"}>
      <div className={"uk-modal-dialog uk-modal-body uk-margin-auto-vertical"}>
        <button
  className={"uk-modal-close-default"}
  type={"button"}
  style={{ background: "none", border: "none" }}
  onClick={props.close}
>
  <span className="uk-margin-small-right" uk-icon="close" />
</button>


        <h3 className={"uk-text-large"}>{"GENERATE MAP"}</h3>

        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>{"Request failed."}</p>
          </div>
        )}

        <div className={"uk-margin"}>
          <label className={"uk-form-label"} htmlFor={"name"}>
            {"NAME"}
          </label>
          <input
            className={"uk-input"}
            id={"name"}
            type={"text"}
            value={name}
            name={"name"}
            placeholder={"Provide name to your key"}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className={"uk-margin"}>
          <div className={"uk-form-controls"}>
            <label className={"uk-form-label"} htmlFor={"allowed-origins"}>
              {"ALLOWED ORIGINS (an origin per a line)"}
            </label>
            <textarea
              className={"uk-textarea"}
              name={"allowedOrigins"}
              id={"allowed-origins"}
              onChange={e => setAllowedOrigins(e.target.value)}
              value={allowedOrigins}
            />
          </div>
        </div>

        <div className={"uk-margin"}>
          <label className={"uk-form-label"} htmlFor={`enabled`}>
            <input
              className={"uk-checkbox"}
              id={`enabled`}
              type={"checkbox"}
              defaultChecked={enabled}
              name={"enabled"}
              onChange={e => setEnabled(e.target.checked)}
            />
            {" ENABLED"}
          </label>
        </div>

        <div className={"uk-margin"}>
          <button
            className={"uk-button uk-button-default"}
            onClick={requestUpdate}
            disabled={requesting}
          >
            <Spinner loading={requesting} />
            {"SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  auth: PropTypes.any,
  onMapCreated: PropTypes.func.isRequired
};

export default Modal;
