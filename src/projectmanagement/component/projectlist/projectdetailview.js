import { TableContainer, Paper, TableRow, TableBody, TableCell, TextField, Table, List, ListItem, ListItemText, ListItemSecondaryAction, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import "../../component/style.css"

export default class ProjectView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            description: "",
            due_date: "",
            user_list: [],
            user: ""
        }

        this.listView = this.listView.bind(this);
        this.editProjectDetails = this.editProjectDetails.bind(this);
    };

    componentDidMount() {
        const {projectData} = this.props;
        this.setState({
            id: projectData.id,
            name: projectData.name,
            description: projectData.description,
            due_date: projectData.due_date,
            user_list: projectData.user_list
        });
    };

    listView(user_list) {
        return (
        <List dense>
            {
                user_list.map((user) => {
                    const labelId = `checkbox-list-secondary-label-${user}`;
                    return (
                        <ListItem key={user} button>
                            <ListItemText id={labelId} primary={user} />
                            <ListItemSecondaryAction>
                                <Button onClick={(e) => {this.removeUserAccess(e, user)}}>
                                    Delete
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>)
    };

    removeUserAccess(e, user) {
        e.preventDefault();
        //Get clone of user_list
        let user_list_clone = [...this.state.user_list];
        //Retrieve index of user
        let index = user_list_clone.indexOf(user);
        //Delete the item
        user_list_clone.splice(index, 1);
        //Set the state
        this.setState({
            user_list: user_list_clone
        })
    }

    onChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    //Check if user is in the list, if so don't allow it to add.
    shareAccessValidator() {
        const {user, user_list} = this.state;
        if (user_list.find(e => e === user) === undefined) {
            //Allow it to add
            return true
        } else {
            return false
        }
    };

    //Submit Data!!!!
    editProjectDetails(e) {
        e.preventDefault();
        const {id, name, description, due_date, user_list} = this.state;
        this.props.editProjectDetails(id, name, description, due_date, user_list)
        this.props.close();
    }

    render() {
        const {name, description, due_date, user_list, user} = this.state;
        return (
            <div className="popup-box">
                <div className="box">
                    <span className="close-icon" onClick={(e) => {this.props.close()}}>x</span>
                    <form className="item-details-form" onSubmit={this.editProjectDetails} onKeyPress={(e) => { e.key === "Enter" && e.preventDefault();}}>
                        <h4>Edit Project Details</h4>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableBody>
                                    {/* Name */}
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>
                                            <TextField
                                                    id="name" 
                                                    className="item-input"
                                                    type="text"
                                                    value={name} 
                                                    onChange={(e) => this.onChange(e)}/>
                                        </TableCell>
                                    </TableRow>
                                    {/* Description */}
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            <TextField
                                                    id="description"
                                                    className="item-input"
                                                    type="text"
                                                    value={description} 
                                                    onChange={(e) => this.onChange(e)}/>
                                        </TableCell>
                                    </TableRow>
                                    {/* Due Date */}
                                    <TableRow>
                                        <TableCell>Due date</TableCell>
                                        <TableCell>
                                            <TextField
                                                    id="due_date"
                                                    className="item-input"
                                                    type="text"
                                                    value={due_date} 
                                                    onChange={(e) => this.onChange(e)}/>
                                        </TableCell>
                                    </TableRow>
                                    {/* User List */}
                                    <TableRow>
                                            <TableCell>Share access (e-mail): </TableCell>
                                            <TableCell>
                                                {!this.shareAccessValidator() ? <p>Already added</p> : null}
                                                <TextField 
                                                    id="user"
                                                    className="item-input"
                                                    type="text"
                                                    value={user}
                                                    onChange={(e) => this.onChange(e)}
                                                    onKeyPress={(ev) => {
                                                        if (ev.key === "Enter" && user !== "" && this.shareAccessValidator()) {
                                                            this.setState({
                                                                user_list: [this.state.user, ...this.state.user_list],
                                                                user: ""
                                                            })
                                                        }
                                                    }}
                                                />
                                                {this.listView(user_list)}
                                            </TableCell>
                                        </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button
                            variant="contained"
                            color="inherit"
                            size="small"
                            type="submit"
                            startIcon={<SaveIcon />}>
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
};