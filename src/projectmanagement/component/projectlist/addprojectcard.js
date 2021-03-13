import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import AddIcon from '@material-ui/icons/Add';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      display: 'block',
      transitionDuration: '0.5s',
      maxWidth: "20vw",
    },
    content: {
      align: "center",
      justifyContent: "center",
      display: "flex",
      textAlign: "center"
    },
    title: {
      fontFamily: "Montserrat"
    },
    addIcon: {
      fontSize: "4vw",
    }
  });

export default function AddProjectCard(props) {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.root}>
        <CardActionArea onClick={()=> props.addProject()}>   
          <CardContent>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">
                Add project
            </Typography>
            <CardContent className={classes.content}>
              <AddIcon className={classes.addIcon}/>
            </CardContent>
          </CardContent>
          
        </CardActionArea>
      </Card>
        </div>
    )
}