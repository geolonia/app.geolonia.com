import React from 'react';

import Grid from '@material-ui/core/Grid';
import Security from './security';
import Profile from './profile';
import Avatar from './avatar';
// import PersonalAccessToken from './personal-access-token';
import Title from '../custom/Title';
import { __ } from '@wordpress/i18n';
import './user.scss';

const User = () => {
  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Your profile'),
      href: null,
    },
  ];

  return (
    <div>
      <Title title={__('Your profile')} breadcrumb={breadcrumbItems}>
        {__('You can update your profile and security.')}
      </Title>

      <Grid container spacing={4}>
        <Grid item sm={12} md={8}>
          <Profile />
          {/* <PersonalAccessToken /> */}
          <Security />
        </Grid>

        <Grid item sm={12} md={4}>
          <Avatar />
        </Grid>
      </Grid>
    </div>
  );
};

export default User;
