import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Grid, Button } from '@material-ui/core';
import Title from '../custom/Title';
import { __ } from '@wordpress/i18n';

const mockStyles = [
  { id: 1, name: 'Style 1', description: 'Description for Style 1' },
  { id: 2, name: 'Style 2', description: 'Description for Style 2' },
  { id: 3, name: 'Style 3', description: 'Description for Style 3' },
];

const MyMapStyles: React.FC = () => {
  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('My Map Styles'),
      href: null,
    },
  ];

  const handleEdit = (id: number) => {
    console.log(__('Editing style with ID: ') + id);
  };

  const handleDelete = (id: number) => {
    console.log(__('Deleting style with ID: ') + id);
  };

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('My Map Styles')} />
      <Grid container spacing={8}>
        {mockStyles.map((style) => (
          <Grid item xs={12} sm={6} md={4} key={style.id}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {style.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {style.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div style={{ padding: '0.5rem', textAlign: 'right' }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(style.id)}
                  style={{ marginRight: '0.5rem' }}
                >
                  {__('Edit')}
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(style.id)}
                >
                  {__('Delete')}
                </Button>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MyMapStyles;
