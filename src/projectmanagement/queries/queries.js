import { gql } from "@apollo/client";

//QUERIES
const GETPROJECTQUERY = gql`
    query Project($id: ID!) {
        project(id: $id) {
            name
            description
            created
            items {
                title
                group
                start
                end
                id
                canMove
                canResize
                bgColor
                completed
            }
            groups {
                title
                id
            }
        }
    }
`
const GETUSERPROJECTLIST = gql`
    query {
        user {
            id
            name
            projects {
                id
                name
                description
                due_date
                progress
                user_list
            }
        }
    }
`

//MUTATIONS
const DELETEPROJECTQUERY = gql`
mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
        id
        groups {
            id
        }
        items {
            id
        }
    }
}
`
const ADDPROJECTQUERY = gql`
mutation AddProject($name: String!, $description: String!, $due_date: String!) {
    addProject(name: $name, description: $description, due_date: $due_date, typename: "project") {
        id
        name
        description
        due_date
    }
}
`
const DELETEGROUP = gql`
mutation DeleteGroup($id: ID!){
    deleteGroup(id: $id) {
        id
        title
        project_id
    }
}
`
const DELETEITEM = gql`
mutation DeleteItems($id: ID!) {
    deleteItem(id: $id) {
        id
    }
}
`

const UPDATETIMEANDGROUPQUERY = gql`
mutation UpdateTimeAndGroup($id: ID!, $start: Float!, $end: Float!, $group: String!) {
    updateTimeAndGroup(id: $id, start: $start, end: $end, group: $group) {
        title
    }
}
`
const UPDATETIMEQUERY = gql`
mutation UpdateTime($id: ID!, $start: Float!, $end: Float!) {
    updateTime(id: $id, start: $start, end: $end) {
        title             
    }
}
`
const ADDGROUPQUERY = gql`
    mutation AddGroup($title: String!, $project_id: String!) {
        addGroup(title: $title, project_id: $project_id) {
            id
            title
            project_id
        }
    }
`
const ADDITEMQUERY = gql`
    mutation AddItems($title: String!, $project_id: String!, $group: String!, $start: Float!, $end: Float!, $className: String!, $bgColor: String!, $completed: Boolean!) {
        addItems(title: $title, project_id: $project_id, group: $group, start: $start, end: $end, className: $className, bgColor: $bgColor, completed: $completed) {
            id
            title
            project_id
            group
            start
            end
            className
            canResize
            canMove
            bgColor
            completed
        }
    }
`

const EDITITEMDETAILS = gql`
    mutation UpdateItem($id: ID, $title: String!, $start: Float!, $end: Float!, $bgColor: String!, $completed: Boolean) {
        updateItem(id: $id, title: $title, start: $start, end: $end, bgColor: $bgColor, completed: $completed) {
            id
            title
            start
            end
            bgColor
            completed
            project_id
        }
    }
`

const EDITPROJECTQUERY = gql`
    mutation editProgress($id: ID, $progress: Float) {
        editProgress(id: $id, progress: $progress) {
            id
            progress

        }
    }
`

const EDITPROJECTDETAILSMUTATION = gql`
    mutation EditProject($id: ID, $name: String, $description: String, $due_date: String, $user_list: [String]) {
        editProject(id: $id, name: $name, description: $description, due_date: $due_date, user_list: $user_list) {
            id
            name
            description
            user_list
        }
    }
`



//Subscription

const ADDPROJECTSUBSCRIPTION = gql`
    subscription projectAdded($id: ID) {
        projectAdded(id: $id) {
            id
            name
            description
            due_date
            progress
        }
    }
`
const REMOVEPROJECTSUBSCRIPTION = gql`
    subscription projectDelete($id: ID) {
        projectDeleted(id: $id) {
            id
            name
            description
            due_date
        }
    }
`

const ADDGROUPSUBSCRIPTIONQUERY = gql`
    subscription groupAdded($id: ID) {
        groupAdded(id: $id) {
            id
            title
            project_id
        }
    }
`
const DELETEGROUPSUBSCRIPTIONQUERY = gql`
    subscription groupDeleted($id: ID) {
        groupDeleted(id: $id) {
            id
            title
            project_id
        }
    }
`

const ADDITEMSSUBSCRIPTIONQUERY = gql`
    subscription itemAdded($id: ID) {
        itemAdded(id: $id) {
            id
            title
            project_id
            group
            start
            end
            className
            canResize
            canMove
            bgColor
            completed
        }
    }
`
const DELETEITEMSSUBSCRIPTIONQUERY = gql`
    subscription itemDeleted($id: ID) {
        itemDeleted(id: $id) {
            id
        }
    }
`

const UPDATETIMESUBSCRIPTIONQUERY = gql`
    subscription updateTime($id: ID) {
        updateTime(id: $id) {
            id
            title
            project_id
            group
            start
            end
            className
            canResize
            canMove
            bgColor
            completed
        }
    }
`

const UPDATETIMEANDGROUPSUBSCRIPTION = gql`
    subscription UpdateTimeAndGroup($id: ID) {
        updateTimeAndGroup(id : $id) {
            id
            title
            project_id
            group
            start
            end
            className
            canResize
            canMove
            bgColor
            completed
        }
    }

`
const EDITITEMDETAILSUBSCRIPTION = gql `
    subscription updateItem($id: ID) {
        updateItem(id: $id) {
            id
            title
            project_id
            group
            start
            end
            className
            canResize
            canMove
            bgColor
            completed
        }
    }
`



export {GETPROJECTQUERY,
    GETUSERPROJECTLIST, 
    ADDPROJECTQUERY, 
    ADDGROUPQUERY,
    DELETEGROUP, 
    DELETEITEM, 
    DELETEPROJECTQUERY,
    UPDATETIMEANDGROUPQUERY,
    UPDATETIMEQUERY,
    ADDPROJECTSUBSCRIPTION,
    REMOVEPROJECTSUBSCRIPTION,
    ADDGROUPSUBSCRIPTIONQUERY,
    ADDITEMQUERY,
    DELETEGROUPSUBSCRIPTIONQUERY,
    ADDITEMSSUBSCRIPTIONQUERY,
    DELETEITEMSSUBSCRIPTIONQUERY,
    UPDATETIMESUBSCRIPTIONQUERY,
    UPDATETIMEANDGROUPSUBSCRIPTION,
    EDITITEMDETAILS,
    EDITITEMDETAILSUBSCRIPTION,
    EDITPROJECTQUERY,
    EDITPROJECTDETAILSMUTATION,
    }