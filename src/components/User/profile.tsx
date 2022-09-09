import React, { useEffect, useState, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Save from '../custom/Save';

// utils
import { __ } from '@wordpress/i18n';
import momentTimeZone from 'moment-timezone';
import { useSession } from '../../hooks/session';
import { sleep } from '../../lib/sleep';

import { useGetUserQuery, useUpdateUserMutation } from '../../redux/apis/app-api';

const selectStyle: React.CSSProperties = {
  marginTop: '16px',
  marginBottom: '8px',
};

const timezones = momentTimeZone.tz.names();

const Profile: React.FC<{}> = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [timezone, setTimezone] = useState('');

  const { userSub } = useSession();
  const { data: user } = useGetUserQuery({ userSub }, { skip: !userSub });
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    const fetchedUser = user || { links: {}, username: '', email: '', name: '', language: '', timezone: '' };
    setUsername(fetchedUser.username);
    setEmail(fetchedUser.email);
    setName(fetchedUser.name);
    setLanguage(fetchedUser.language);
    setTimezone(fetchedUser.timezone);
  }, [user]);

  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const nextEmail = event.target.value;
    setEmail(nextEmail);
  }, []);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const nextName = event.target.value;
    setName(nextName);
  }, []);

  const handleLanguageChange = useCallback((event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    const nextLanguage = event.target.value as string;
    setLanguage(nextLanguage);
  }, []);

  const handleTimezoneChange = useCallback((event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    const nextTimezone = event.target.value as string;
    setTimezone(nextTimezone);
  }, []);

  const handleNameBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value;
    setName(name.trim());
  }, []);

  const handleSaveClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const nextUser =  { name, timezone, language };
    if (userSub) {
      await updateUser({ userSub, updates: nextUser });
      await sleep(500);
      window.location.reload();
    }
  }, [language, name, timezone, updateUser, userSub]);

  const saveDisabled = name === '';

  return (
    <div className="grid-item-container">
      <TextField
        id="username"
        label={__('Username')}
        margin="normal"
        value={username}
        fullWidth={true}
        disabled
      />

      <TextField
        id="email"
        label={__('Email')}
        margin="normal"
        value={email}
        onChange={handleEmailChange}
        fullWidth={true}
        // NOTE: currently disabled
        disabled
      />

      <TextField
        id="display-name"
        label={__('Name')}
        margin="normal"
        value={name}
        onChange={handleNameChange}
        fullWidth={true}
        onBlur={handleNameBlur}
      />

      <FormControl fullWidth={true} style={selectStyle}>
        <InputLabel htmlFor="select-language">{__('Language')}</InputLabel>
        <Select
          id="select-language"
          fullWidth={true}
          value={language}
          onChange={handleLanguageChange}
        >
          <MenuItem value="en">{'English'}</MenuItem>
          <MenuItem value="ja">{'日本語'}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth={true} style={selectStyle}>
        <InputLabel htmlFor="select-timezone">{__('Time zone')}</InputLabel>
        <Select
          id="select-timezone"
          fullWidth={true}
          value={timezone}
          onChange={handleTimezoneChange}
        >
          {timezones.map((timezoneName: string) => (
            <MenuItem key={timezoneName} value={timezoneName}>
              {timezoneName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Save onClick={handleSaveClick} disabled={saveDisabled} />
    </div>
  );
};

export default Profile;
