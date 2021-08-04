import React, { useMemo } from 'react'
import { __ } from '@wordpress/i18n'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const getTutorialContents = () => {
  return [
    {
      title: __('How to use the Dashboard'),
      excerpt: __('Learn about the easiest way to embed a Geolonia map in your website.'),
      url: 'https://docs.geolonia.com/tutorial/',
    },
    {
      title: __('Embed API'),
      excerpt: __('The Embed API allows you to set up a map with just a simple HTML code.'),
      url: 'https://docs.geolonia.com/embed-api/'
    },
    {
      title: __('JavaScript API'),
      excerpt: __('Learn how to develop a professional map application using the JavaScript API.'),
      url: 'https://docs.geolonia.com/javascript-api/'
    },
    {
      title: __('Custom Style'),
      excerpt: __('Learn how to customize the style of your map.'),
      url: 'https://docs.geolonia.com/custom-style/',
    },
    {
      title: __('Support'),
      excerpt: __('Please contact us if you have any questions about how to use the admin panel or if you need technical support (which may be paid).'),
      url: 'https://geolonia.com/contact/',
    },
  ]
}

const useStyles = makeStyles({
  root: {

  },
  animationArea: {

  },
  content: {
  },
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '10px',
  },
  icon: {
    marginRight: '10px'
  },
  excerpt: {},
  button: {
    color: '#EB5C0B'
  }
})

export const Tutorials: React.FC = () => {
  const turotialContents = useMemo(getTutorialContents, [])
  const classes = useStyles()

  return <Grid container spacing={2}>
    {
      turotialContents.map((post) => <Grid item lg={4} md={6} xs={12} key={post.title}>
        <Card className={classes.root} variant="outlined" >
          <CardActionArea className={classes.animationArea} onClick={() => window.open(post.url, '_blank')}>
            <CardContent  className={classes.content}>
              <div>
                <div className={classes.titleBox}>
                  <PlayCircleOutlineIcon className={classes.icon} style={{ color: '#EB5C0B' }}/>
                  <Typography variant="h6" component="h2">{post.title}</Typography>
                </div>
                <Typography variant="body2" color="textSecondary" component="p" className={classes.excerpt}>{post.excerpt}</Typography>
              </div>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button className={classes.button} size="small">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Grid>)
    }
  </Grid>
}

export default Tutorials