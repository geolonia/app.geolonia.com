import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";
import fetch from "../../lib/fetch";
import { connect } from "react-redux";
import { AppState, Session } from "../../types";
import { GeoloniaConstantPlan } from "./Billing";
import {
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  plans: GeoloniaConstantPlan[];
  currentPlanId: string | null | undefined;
};
type StateProps = {
  session: Session;
  teamId?: string;
};
type Props = OwnProps & StateProps;

const modalStyle: React.CSSProperties = {
  position: "absolute",
  minWidth: 600,
  top: `50%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
  background: "white",
  padding: "2em 4em 3em"
};

const { REACT_APP_STAGE } = process.env;

const PlanModal = (props: Props) => {
  const { open, handleClose, session, teamId, plans, currentPlanId } = props;
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [planId, setPlanId] = React.useState<string | null | undefined>(void 0);

  const handleSubmit = async () => {
    if (!teamId) {
      return null;
    }
    setLoading(true);
    fetch(
      session,
      `https://api.app.geolonia.com/${REACT_APP_STAGE}/teams/${teamId}/plan`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ planId })
      }
    )
      .then(res => {
        if (res.status < 400) {
          handleClose();
          window.location.reload();
        } else {
          throw new Error();
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Typography component="h3">{__("Your plan")}</Typography>
        {plans.map(plan => (
          <RadioGroup key={plan.planId} name="plan">
            <FormControlLabel
              value={plan.planId}
              control={
                <Radio
                  checked={
                    plan.planId === (planId === void 0 ? currentPlanId : planId)
                  }
                  onChange={e => setPlanId(plan.planId)}
                />
              }
              label={`${plan.name} ${plan.duration}ly`}
            />
            {/* <DialogContentText>
            <ul>
              <li>{__("can invite another team member.")}</li>
              <li>{__("can designate another owner.")}</li>
              <li>{__("can suspend another member.")}</li>
              <li>
                {__(
                  "Can manage all resources in the team, including API Keys."
                )}
              </li>
            </ul>
          </DialogContentText> */}
          </RadioGroup>
        ))}
        <p>{message}</p>
        <Button
          variant="contained"
          color="primary"
          onClick={e => {
            e.preventDefault();
            handleSubmit();
          }}
          type={"button"}
        >
          {" "}
          {loading && (
            <CircularProgress
              size={16}
              style={{ marginRight: 8 }}
              color={"inherit"}
            />
          )}
          {__("Update")}
        </Button>
      </div>
    </Modal>
  );
};

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(PlanModal);
