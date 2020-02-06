import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import {Icon, Avatar} from 'antd';


const useStyles = makeStyles({
  card: {
    background: 'linear-gradient(to right, #f5f5f5, #fafafa, white)',
    color: '#757575',
  },
  avatar: {
    backgroundColor: props => props.color,
    float: 'right'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard({children, ...props}) {
  const classes = useStyles(props);

  return (
    <Card className={classes.card} style={{ }}>
      <CardContent>
        <Typography variant="h6" style={{color: '#757575', fontWeight: 'bold', fontFamily: 'Arial, Helvetica'}}>
          {props.label}<Avatar className={classes.avatar} icon={props.logo} />
        </Typography>
         <br/>
        <Divider variant="middle" style={{backgroundColor: "silver"}}/>
        <br/>
        <Typography variant="body2" component="p" style={{textAlign: "right", fontFamily: 'Century Gothic'}}>
        <span style={{float: 'left'}}>{props.text}</span> <span style={{float: 'right', fontSize: '1.8em'}}>{props.count}</span>
        </Typography>
      </CardContent>
      <br/>
    </Card>
  );
}
