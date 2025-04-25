import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@material-ui/core';
import Title from '../custom/Title';
import { __ } from '@wordpress/i18n';

const CreateMapStyle: React.FC = () => {
  const [styleName, setStyleName] = useState('');

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Create Map Styles'),
      href: null,
    },
  ];

  const handleCreate = () => {
    alert(__('Map style created: ') + styleName);
    setStyleName('');
  };

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('Create Map Styles')} />
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {__('Enter a name for your new map style')}
              </Typography>
              <TextField
                label={__('Style Name')}
                variant="outlined"
                fullWidth
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={!styleName.trim()}
              >
                {__('Create')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateMapStyle;
