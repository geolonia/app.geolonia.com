import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

type BlogPost = {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  date_published: string;
};

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  media: {
    height: 140,
  },
  date_published: {
    textAlign: 'right',
    marginTop: '0.5rem',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  title: {
    lineHeight: '1.4em',
    fontSize: '15px',
  },
  actionArea: {
    height: '100%',
    position: 'relative',
  },
});

const DeveloperBlog = () => {
  const [blogItems, setBlogItems] = useState<BlogPost[]>([]);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const endpoint = 'https://blog.geolonia.com/feed.json';
      const resp = await fetch(endpoint);
      const json = await resp.json();
      setBlogItems(json.items);
    })();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {blogItems.map((post, index) => {
          let thumbnail_url = post.thumbnail
          try {
            const thumbnail_host = new URL(post.thumbnail).host
            if (thumbnail_host.endsWith('ucarecdn.com')) {
              thumbnail_url = `${thumbnail_url}-/resize/800x/-/format/auto/-/quality/lightest/`
            }
          } catch {
            // ignore
          }

          return (
            <Grid item lg={3} md={6} xs={12} key={index}>
              <Card className={classes.root}>
                <CardActionArea className={classes.actionArea} onClick={() => window.open(post.url, '_blank')}>
                  <CardMedia
                    className={classes.media}
                    image={thumbnail_url}
                    title={post.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.title}>{post.title}</Typography>
                    <div className={classes.date_published}>{post.date_published}</div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default DeveloperBlog;
