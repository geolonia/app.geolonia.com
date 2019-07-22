import React, { useState } from "react";
import PropTypes from "prop-types";
import Spinner from "./spinner";
import { __ } from "@wordpress/i18n";

const ModalBeforeDelete = props => {
  if (!props.open) {
    return null;
  }

  const [confirmText, setConfirmText] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(false);

  const requestDelete = async () => {
    setRequesting(true);

    return props.auth.API.deleteKey(props.userKey)
      .then(() => {
        props.close();
        props.onDeleteSuccess();
      })
      .catch(() => setError({ error: true, requesting: false }));
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
          <span className={"uk-margin-small-right"} uk-icon={"close"} />
        </button>

        {error && (
          <div uk-alert={"true"} className={"uk-alert-danger"}>
            <p className={"uk-padding"}>
              {__("Request failed.", "geolonia-dashboard")}
            </p>
          </div>
        )}

        <div className={"uk-margin"}>
          <p
            dangerouslySetInnerHTML={{
              __html: __(
                "If you really want to delete this map, please type <code>delete</code>.",
                "geolonia-dashboard"
              )
            }}
          ></p>
          <input
            className={"uk-input"}
            id={"confirm-text"}
            type={"text"}
            value={confirmText}
            name={"confirm-text"}
            onChange={e => setConfirmText(e.target.value)}
          />
        </div>

        <div className={"uk-margin"}>
          <button
            className={"uk-button uk-button-danger"}
            onClick={requestDelete}
            disabled={confirmText !== "delete"}
          >
            <Spinner loading={requesting} />
            {__("delete this map", "geolonia-dashboard")}
          </button>
        </div>
      </div>
    </div>
  );
};

ModalBeforeDelete.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  auth: PropTypes.any,
  onDeleteSuccess: PropTypes.func.isRequired,
  userKey: PropTypes.string.isRequired
};

export default ModalBeforeDelete;
