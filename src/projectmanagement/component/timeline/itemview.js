import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Switch from '@material-ui/core/Switch';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import {EDITITEMDETAILS} from '../../queries/queries';
import { print } from 'graphql';

export default class ItemView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            title : "",
            start : "",
            end : 0,
            bgColor : "",
            completed: false,
        };
    }

    componentDidMount() {
        //Set the state to props.content
        const {content} = this.props;
        var start = moment(content['start']).format("yyyy-MM-DD[T]hh:mm");
        var end = moment(content['end']).format("yyyy-MM-DD[T]hh:mm");
        console.log(start)
        this.setState({
            id: content.id,
            title: content['title'],
            start,
            end,
            bgColor: content['bgColor'],
            completed: content.completed
        });
        this.onSubmit = this.onSubmit.bind(this);
    };

    onChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    onCompletedChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.checked
        })
    }

    async onSubmit(e) {
        e.preventDefault();
        const {id, title, start, end, bgColor, completed} = this.state;
        let start_unix = parseInt(moment(start).format('x'))
        console.log(start_unix)
        let end_unix = parseInt(moment(end).format('x'))
        //POST data.
        await axios.post(process.env.REACT_APP_APIURL, {
            query: print(EDITITEMDETAILS),
            variables: {
                id, title, start: start_unix, end: end_unix, bgColor, completed
            }
        })
        .catch(err => {console.log(err.response)})
    }

    render() {
        const {title, start, end, bgColor, completed} = this.state;
        return (
            <div className="popup-box">
                <div className="box">
                    <span className="close-icon" onClick={this.props.close()}>x</span>
                    <form className="items-details-form" onSubmit={(e) => {this.onSubmit(e).then(this.props.close())}}>
                    <h4>Item Settings</h4>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>
                                        <TextField 
                                            className="item-input"
                                            id="title" 
                                            type="text" 
                                            value={title} 
                                            onChange={(e) => this.onChange(e)} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Start</TableCell>
                                    <TableCell> 
                                        <TextField
                                            className="item-input"
                                            id="start"
                                            type="datetime-local"
                                            value={start}
                                            InputLabelProps={{
                                            shrink: true,
                                            }}
                                            onChange={(e)=> this.onChange(e)}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Due</TableCell>
                                    <TableCell> 
                                        <TextField
                                            className="item-input"
                                            id="end"
                                            type="datetime-local"
                                            value={end}
                                            InputLabelProps={{
                                            shrink: true,
                                            }}
                                            onChange={(e)=> this.onChange(e)}
                                        />
                                        {(start>=end) ? <h5 className="date-error">Error: The task starts later than it's due date.</h5> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Color</TableCell>
                                    <TableCell> 
                                        <TextField
                                            className="item-input"
                                            id="bgColor"
                                            type="color"
                                            label={bgColor}
                                            value={bgColor}
                                            InputLabelProps={{
                                            shrink: true,
                                            }}
                                            onChange={(e)=> this.onChange(e)}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Completed</TableCell>
                                    <TableCell> 
                                        <Switch
                                            id="completed"
                                            checked={completed}
                                            onChange={(e) => this.onCompletedChange(e)}/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        type="submit"
                        startIcon={<SaveIcon />}
                        disabled={start >= end}
                    >Save</Button>
                    </form>
                   
                </div>
          </div>
        )
    }
}
