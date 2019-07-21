import React, { useState } from "react";
import PropTypes from "prop-types";
import Spinner from "./spinner";
import { __ } from "@wordpress/i18n";
import normalizeURL from "../lib/normalize-url";

const Modal = props => {
  if (!props.open) {
    return null;
  }

  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [allowedOrigins, setAllowedOrigins] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(false);

  const requestUpdate = async () => {
    setRequesting(true);
    let initialData;
    const nextAllowedOrigins = allowedOrigins
      .split("\n")
      .map(normalizeURL)
      .filter(x => !!x);
    const updateProps = {
      name,
      enabled,
      allowedOrigins:
        nextAllowedOrigins.length === 0 ? void 0 : nextAllowedOrigins
    };
    try {
      initialData = await props.auth.API.createKey();
      await props.auth.API.updateKey(initialData.userKey, updateProps);
      props.onMapCreated({ ...initialData, ...updateProps });
    } catch (error) {
      // console.error(error);
      setError(error);
    }
    setRequesting(false);
    props.close();
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

        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>
              {__("Request failed.", "geolonia-dashboard")}
            </p>
          </div>
        )}

        <div className={"uk-margin"}>
          <label className={"uk-form-label uk-text-uppercase"} htmlFor={"name"}>
            {__("map name", "geolonia-dashboard")}
          </label>
          <input
            className={"uk-input"}
            id={"name"}
            type={"text"}
            value={name}
            name={"name"}
            placeholder={__("map name", "geolonia-dashboard")}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className={"uk-margin"}>
          <div className={"uk-form-controls"}>
            <label className={"uk-form-label"} htmlFor={"allowed-origins"}>
              <span className={"uk-text-uppercase"}>
                {__("allowed origins", "geolonia-dashboard")}
              </span>
              {` (${__("an origin per a line", "geolonia-dashboard")})`}
            </label>
            <textarea
              className={"uk-textarea"}
              name={"allowedOrigins"}
              id={"allowed-origins"}
              onChange={e => setAllowedOrigins(e.target.value)}
              value={allowedOrigins}
              rows={3}
              placeholder={__(
                "e.g.\nhttps://example.com\nhttp://example.com",
                "geolonia-dashboard"
              )}
            />
          </div>
        </div>

        <div className={"uk-margin"}>
          <label
            className={"uk-form-label uk-text-uppercase"}
            htmlFor={`enabled`}
          >
            <input
              className={"uk-checkbox"}
              id={`enabled`}
              type={"checkbox"}
              defaultChecked={enabled}
              name={"enabled"}
              onChange={e => setEnabled(e.target.checked)}
            />
            {` ${
              enabled
                ? __("make it enabled", "geolonia-dashboard")
                : __("make it disabled", "geolonia-dashboard")
            }`}
          </label>
        </div>

        <div className={"uk-margin"}>
          <button
            className={"uk-button uk-button-default"}
            onClick={requestUpdate}
            disabled={requesting}
          >
            <Spinner loading={requesting} />
            {__("generate map", "geolonia-dashboard")}
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
