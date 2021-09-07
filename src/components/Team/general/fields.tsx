import React, { useState, useEffect, useCallback } from 'react';

// Components
import TextField from '@material-ui/core/TextField';
import Save from '../../custom/Save';

// utils
import { __ } from '@wordpress/i18n';
import { Roles } from '../../../constants';
import { useSelectedTeam } from '../../../redux/hooks';
import { useUpdateTeamMutation } from '../../../redux/apis/app-api';

// type OwnProps = Record<string, never>;
// type StateProps = {
//   session: Geolonia.Session;
//   selectedIndex: number;
//   team: Geolonia.Team;
// };
// type DispatchProps = {
//   updateTeamState: (index: number, team: Partial<Geolonia.Team>) => void;
// };
// type Props = OwnProps & StateProps & DispatchProps;

const Content: React.FC = (props) => {
  // props
  // const { session, team, selectedIndex, updateTeamState } = props;
  const team = useSelectedTeam();

  const [
    updateTeam,
  ] = useUpdateTeamMutation();

  // state
  const [draft, setDraft] = useState<Partial<Geolonia.Team>>({});

  const onNameBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>((e) => {
    const name = e.currentTarget.value;
    setDraft((draft) => ({ ...draft, name: name.trim() }));
  }, []);

  // effects
  //// clear draft on Team change
  useEffect(() => setDraft({}), [team]);

  const onSaveClick = useCallback(async () => {
    if (!team) return;

    await updateTeam({ teamId: team.teamId, updates: draft });
    setDraft({});
  }, [draft, team, updateTeam]);

  const draftExists = Object.keys(draft).length !== 0;
  const isOwner = team?.role === Roles.Owner;

  let saveDisabled = !draftExists || !isOwner;
  if (typeof draft.name === 'string') {
    if (draft.name.trim() === '') {
      saveDisabled = true;
    }
  }

  return (
    <>
      <TextField
        id="team-name"
        label={__('Team Name')}
        margin="normal"
        fullWidth={true}
        value={(draft.name === void 0 ? team?.name : draft.name) || ''}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        disabled={isOwner !== true}
        onBlur={onNameBlur}
      />
      {/* <TextField
        id="team-description"
        label={__("Description")}
        margin="normal"
        multiline={true}
        rows={5}
        fullWidth={true}
        value={
          (draft.description === void 0 ? description : draft.description) || ""
        }
        onChange={e => setDraft({ ...draft, description: e.target.value })}
        disabled={isOwner !== true}
      />
      <TextField
        id="team-url"
        label={__("URL")}
        margin="normal"
        fullWidth={true}
        value={(draft.url === void 0 ? url : draft.url) || ""}
        onChange={e => setDraft({ ...draft, url: e.target.value })}
        disabled={isOwner !== true}
      /> */}

      <TextField
        fullWidth={true}
        label={__('Billing email')}
        required={true}
        disabled={isOwner !== true}
        value={(draft.billingEmail === void 0 ? team?.billingEmail : draft.billingEmail) || ''}
        onChange={useCallback((e) => {
          setDraft((draft) => ({ ...draft, billingEmail: e.target.value }));
        }, [])}
      />

      <p className="mute">{__('Receipts and other billing-related notifications will be sent to this e-mail address.')}</p>

      <Save onClick={onSaveClick} disabled={saveDisabled} />
    </>
  );
};

export default Content;
