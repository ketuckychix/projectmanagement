import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import ProjectPage from './projectpage';
import ProjectTimelinePage from '../timeline/projectTimelinePage'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../style.css';
import moment from 'moment';
import {GETUSERPROJECTLIST, DELETEPROJECTQUERY, ADDPROJECTQUERY, ADDPROJECTSUBSCRIPTION, REMOVEPROJECTSUBSCRIPTION, EDITPROJECTDETAILSMUTATION} from '../../queries/queries'
import './projectlist.scss';
import ErrorPage from '../../../error/errorpage';


function ProjectList(props) {
    const {subscribeToMore, loading, error, data} = useQuery(GETUSERPROJECTLIST, {fetchPolicy: "network-only"});
    const [projectView, setProjectView] = useState(false);
    const [projectID, setProjectID] = useState('');
    const [onDeleteHandler, {loading: deleting, error: deleteError}] = useMutation(DELETEPROJECTQUERY);
    const [addProjectHandler, {loading: adding, error: addError}] = useMutation(ADDPROJECTQUERY);
    const [editProjectDetailsHandler, {loading: editingProject}] = useMutation(EDITPROJECTDETAILSMUTATION);

    if (loading || deleting || editingProject || adding) return (<div className="centered"><CircularProgress /></div>);
    // if (error) return <ErrorPage message={error.message}/>;
    if (error) return `Error! ${error.message}`
    if (deleteError) return `Error! ${deleteError.message}`;
    if (addError) return `Error! ${addError.message}`;

    /**
     * This function will delete the project, and afterwhich it will delete the data within the project.
     * @param {ID} id project_id
     */
    const onDelete = (id) => {
        onDeleteHandler({
            variables: {id},
            optimisticResponse: true,
            update: (cache) => {
                //Delete unreacheable cache and ensure that there is no deleteError.
                if (!deleteError) {
                    cache.gc();
                }
            }
        })  
    };
 

    /**
     * Calling showProjectTimeLine will set the state of projectView to true; this will render the project timeline and unmount the project list component.
     * @param {ID} id Project ID to load
     */
    const showProjectTimeLine = (id) => {
        setProjectView(true);
        setProjectID(id)
    };

    /**
     * Calling onAddProject will prompt the user for the project name, description, due date.
     * If conditions are non null, useMutation will be called to add project to datanits.projects.
     * else, it will return.
     */
    const onAddProject = () => {
        var projectname = prompt("Project Name");
        if (projectname !== null) {
            var description = prompt("Describe your project");
            if (description !== null) {
                var due_date = prompt("Due date (dd/mm/yyy)", moment().format('DD/MM/yyyy'))
                if (due_date !== null) {
                    addProjectHandler({
                        variables: {name: projectname, description: description, due_date: due_date},
                        optimisticResponse: true,
                    })
                }

            }
        } else {
            return
        }
    };

    /**
     * Subscription that listens to project that is added, receiving data from the websocket link defined in ../projectmanagement.js
     */
    const addProjectSubscription = () => {
        subscribeToMore(
            {
            document: ADDPROJECTSUBSCRIPTION,
            variables: {id: props.id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const newProjectItem = subscriptionData.data.projectAdded;
                const existingProjects = prev.user.projects;
                return Object.assign({}, prev, {
                    user : {
                        __typename: "user",
                        name: prev.user.name,
                        projects: [newProjectItem, ...existingProjects]
                    }
                })
            }
            }
        )
    };

    /**
     * Subscription that listens to project that is removed, receiving data from the websocket link defined in ../projectmanagement.js
     */
    const removeProjectSubcription = () => {
        subscribeToMore({
            document: REMOVEPROJECTSUBSCRIPTION,
            variables: {id: props.id},
            updateQuery: (prev, {subscriptionData}) => {
                //If there is no data, return the prev;
                if (!subscriptionData.data) return prev;
                let removedProjectItem = subscriptionData.data.projectDeleted;
                let existingProjects = [...prev.user.projects];
                //Find index of removedProjectItem
                let newProjectsArray = existingProjects.filter(projects => projects.id !== removedProjectItem.id)
                return Object.assign({}, prev, {
                    user: {
                        __typename: "user",
                        name: prev.user.name,
                        projects: newProjectsArray
                    }
                })

            }
        })
    }

    /**
     * Edit the project for user access control
     * @param {String} id Project ID to be updated
     * @param {String} name Project name
     * @param {String} description Description
     * @param {due_date} due_date Due date
     * @param {Array} user_list user list
     */
    const editProjectDetails = (id, name, description, due_date, user_list) => {
        editProjectDetailsHandler({
            variables: {id, name, description, due_date, user_list},
            optimisticResponse: true,
            update: (cache) => {
                cache.gc();
            }
        })
    };


    /**
     * If projectView is set to false; render the projectlist
     */
    if (!projectView) {
        return (
            <div>
                {
                    <div className="main-content">
                        <h3 className="shared-text">My Projects</h3>
                        <ProjectPage
                                addProject={onAddProject}
                                data={data.user.projects[0]} 
                                setProjectView={showProjectTimeLine} 
                                deleteProject={onDelete}
                                subscribeToNewProject={addProjectSubscription}
                                subscribeToRemoveProject={removeProjectSubcription}
                                editProjectDetails={editProjectDetails}
                        />
                        <div>
                            <h3 className="shared-text">Shared with me</h3>
                            <ProjectPage 
                                data={data.user.projects[1]} 
                                setProjectView={showProjectTimeLine} 
                                subscribeToNewProject={addProjectSubscription}
                                subscribeToRemoveProject={removeProjectSubcription}
                                editProjectDetails={editProjectDetails}
                                
                            />
                        </div>    
                    </div>
                }

            </div>
        ) 
    };

    /**
     * If projectView is true, render the project timeline page with PROPS project_id set to STATE projectID
     */
    if (projectView) return (<div><ProjectTimelinePage project_id={projectID}/></div>)
}




export default ProjectList