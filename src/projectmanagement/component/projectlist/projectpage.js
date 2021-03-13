import React from 'react';
import ProjectCards from './projectcards';
import { GridList, GridListTile } from "@material-ui/core";
import AddProjectCard from './addprojectcard';
import ProjectView from './projectdetailview';

/**
 * This component will be incharge of the grid styling.
 */
export default class ProjectPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectDetailView: false,
            projectData: {}
        };

        this.openProjectDetailsView = this.openProjectDetailsView.bind(this);
        this.closeProjectDetailsView = this.closeProjectDetailsView.bind(this);
    };

    componentDidMount() {
        this.props.subscribeToNewProject();
        this.props.subscribeToRemoveProject();
    }

    /**
     * Return the addProjectCard only in the "Your Projects Columns"
     */
    sharedOrOwned() {
        if (this.props.addProject === undefined) {
            return null
        } else {
            return (
                <GridListTile key={1} style={{height:"190px"}}>
                     <AddProjectCard addProject={this.props.addProject} />
                </GridListTile>
            )
        }
    };

    /**
     * Set the state to show pop up box and set the projectData
     * @param {Object} data Data of the project
     */
    openProjectDetailsView(data) {
        this.setState({
            projectDetailView: true,
            projectData: data
        })
    };

    /**
     * Close Project Details View
     */
    closeProjectDetailsView() {
        this.setState({
            projectDetailView: false,
            projectData: {}
        })
    }

    render() {
        const {data, setProjectView, deleteProject, editProjectDetails} = this.props; 
        const {projectDetailView, projectData} = this.state;  
        return (
            <div>
                <GridList style={{
                    width: '100%',
                    maxHeight: 320,}} cols={4} spacing={20} cellHeight={'auto'}>
                    {this.sharedOrOwned()}
                {
                    data.map(data => 
                        <GridListTile key={data.id} style={{height:"190px"}}>
                            <ProjectCards key={data.id} 
                             setProjectView={setProjectView}
                             id={data.id}
                             due_date={data.due_date}
                             name={data.name}
                             description={data.description}
                             user_list={data.user_list}
                             delete={deleteProject}
                             progress={data.progress}
                             openProjectDetailsView={this.openProjectDetailsView}
                                       
                            />
                        </GridListTile>
                    )

                }
                </GridList>
                {
                    projectDetailView && <ProjectView projectData={projectData} editProjectDetails={editProjectDetails} close={this.closeProjectDetailsView}/>
                }
            </div>
        )
    }
}