import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Grid, Collapse } from '@material-ui/core';
import links from '../../assets/external-links.json';
import Title from '../custom/Title';
import { __ } from '@wordpress/i18n';

type LinkItem = {
	url: string;
	description: string;
};

const OpenData: React.FC = () => {

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Open Data'),
      href: null,
    },
  ];

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('Open Data')} />
      <p>スマートマップまたは、geolonia製オープンデータカタログサイトにアクセスし、データを書き出すことができます。</p>
      <Collapse in={true}>
        <p>手順です</p>
      </Collapse>
      <Grid container spacing={8}>
        {Object.entries(links).map(([category, items]) => (
          <Grid item xs={12} key={category}>
            <h2 style={{ marginTop: '32px' }}>{__(category)}</h2>
            <Grid container spacing={2}>
              {Object.entries(items as Record<string, LinkItem>).map(([title, link]) => (
                <Grid item xs={12} sm={6} md={4} key={title}>
                  <Card>
                    <CardActionArea href={link.url} target="_blank" rel="noopener noreferrer">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {title}
                        </Typography>
                        {link.description && (
                          <Typography variant="body2" color="textSecondary">
                            {link.description}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OpenData;
