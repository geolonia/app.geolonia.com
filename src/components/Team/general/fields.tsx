import React, { useState, useEffect, useCallback } from 'react';

// Components
import TextField from '@material-ui/core/TextField';
import Save from '../../custom/Save';

// utils
import { __ } from '@wordpress/i18n';
import { Roles } from '../../../constants';
import { useSelectedTeam } from '../../../redux/hooks';
import { useUpdateTeamMutation } from '../../../redux/apis/app-api';

const Content: React.FC = () => {
  // props
  const { selectedTeam } = useSelectedTeam();

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
  useEffect(() => setDraft({}), [selectedTeam]);

  const onSaveClick = useCallback(async () => {
    if (!selectedTeam) return;

    await updateTeam({ teamId: selectedTeam.teamId, updates: draft });
    setDraft({});
  }, [draft, selectedTeam, updateTeam]);

  const draftExists = Object.keys(draft).length !== 0;
  const isOwner = selectedTeam?.role === Roles.Owner;

  let saveDisabled = !draftExists || !isOwner;
  if (typeof draft.name === 'string') {
    if (draft.name.trim() === '') {
      saveDisabled = true;
    }
  }

  return (
    <div className="grid-item-container">
      <TextField
        id="team-name"
        label={__('Team Name')}
        margin="normal"
        fullWidth={true}
        value={(draft.name === void 0 ? selectedTeam?.name : draft.name) || ''}
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
        value={(draft.billingEmail === void 0 ? selectedTeam?.billingEmail : draft.billingEmail) || ''}
        onChange={useCallback((e) => {
          setDraft((draft) => ({ ...draft, billingEmail: e.target.value }));
        }, [])}
      />

      <p className="mute">{__('Receipts and other billing-related notifications will be sent to this e-mail address.')}</p>

      <Save onClick={onSaveClick} disabled={saveDisabled} />
    </div>
  );
};

export default Content;
