import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

type BlogPost = {
  id : string;
  url: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  date_published: string;
}

type Props = {
};

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  media: {
    height: 140,
  },
  date_published: {
    textAlign: "right",
    marginTop: "0.5rem",
  },
});

const Content = (props: Props) => {
  const [blogItems, setBlogItems] = React.useState<BlogPost[]>([])
  const classes = useStyles();

  React.useEffect(() => {
    const endpoint = "https://blog.geolonia.com/feed.json"
    fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        setBlogItems(json.items)
      });
  }, [])

  return (
    <>
      <Grid container spacing={2}>
      {blogItems.map((post, index) => {
        return (
          <Grid item sm={6} xs={12}>
            <Card className={classes.root}>
              <CardActionArea onClick={() => window.location.href = post.url}>
                <CardMedia
                  className={classes.media}
                  image={post.thumbnail}
                  title={post.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">{post.title}</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">{post.excerpt}</Typography>
                  <div className={classes.date_published}>{post.date_published}</div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })}
      </Grid>
    </>
  );
};

export default Content;
