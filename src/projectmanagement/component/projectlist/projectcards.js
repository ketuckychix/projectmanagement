import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  root: {
    display: 'block',
    transitionDuration: '0.5s',
    maxWidth: "20vw",
    maxHeight: "50vw"
  },
  title: {
    fontFamily: 'Montserrat',
  },
  body: {
    fontFamily: 'Montserrat',
  },
  content: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.5,
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  },
});

export default function ProjectCards(props) {

  const classes = useStyles();
  return (
    <div>
      <Card className={classes.root}>
        <CardActionArea onClick={()=>props.setProjectView(props.id)} >
          <CardContent className={classes.content}>
          <LinearProgress variant="determinate" value={props.progress}/>
          <Typography className={classes.title} color="textSecondary" align="right">
            Due on {props.due_date}
          </Typography>
    
          <Typography noWrap className={classes.title} gutterBottom variant="h6">
              {props.name}
            </Typography>
            <Typography noWrap className={classes.body} variant="body2" color="textSecondary" component="p">
              {props.description}
            </Typography>   
          </CardContent>
        </CardActionArea>
        <CardActions>
          {
            (props.delete) ?
              <Button className={classes.title} size="small" color="primary" onClick={()=>props.delete(props.id)}>
                      Delete
              </Button> :
              null
          }
          <Button className={classes.title} size="small" color="primary" onClick={() => {
                props.openProjectDetailsView(props)
              }
            }
          >
            Edit
          </Button>
          
        </CardActions>
  
      </Card>

    </div>  
  );
}

