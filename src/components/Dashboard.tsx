import React from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { __ } from '@wordpress/i18n';

import './Dashboard.scss';

import Tutorials from './Tutorials';
import DeveloperBlog from './DeveloperBlog';

const Dashboard: React.FC = () => {
  return (
    <div id="dashboard">

      <Paper className="getting-started">
        <div className="box-content">
          <h2>{__('Get started with Geolonia map')}</h2>
          <p>{__('First, you need to obtain an API key and set up the initial settings for the map design and display position.')}<br/>{__('After that, add the generated HTML code snippet to your website to display the map you have created.')}</p>
          <Button className="create-new" variant="contained" size="large" onClick={() => window.location.href = '/#/api-keys'}>{__('Create map')}</Button>
        </div>
      </Paper>

      <h2 style={{ marginTop: '32px' }}>{__('Tutorials')}</h2>
      <Tutorials></Tutorials>

      <h2 style={{ marginTop: '32px' }}>{__('Developer\'s Blog')}</h2>
      <DeveloperBlog />
    </div>
  );
};

export default Dashboard;
