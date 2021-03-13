import React from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {GETPROJECTQUERY, 
    UPDATETIMEANDGROUPQUERY, 
    UPDATETIMEQUERY, 
    ADDGROUPSUBSCRIPTIONQUERY, 
    ADDGROUPQUERY, 
    ADDITEMQUERY,
    DELETEGROUP,
    DELETEGROUPSUBSCRIPTIONQUERY,
    ADDITEMSSUBSCRIPTIONQUERY,
    DELETEITEM,
    DELETEITEMSSUBSCRIPTIONQUERY,
    UPDATETIMESUBSCRIPTIONQUERY,
    UPDATETIMEANDGROUPSUBSCRIPTION,
    EDITITEMDETAILSUBSCRIPTION,
    EDITPROJECTQUERY} from '../../queries/queries';
import { CircularProgress } from '@material-ui/core';
import Timeline from './projectTimeline';
import axios from "axios";
import { print } from 'graphql';
import '../style.css';

export default function ProjectTimelinePage({project_id}) {
    const {subscribeToMore, loading, error, data} = useQuery(GETPROJECTQUERY, {variables: {id: project_id}, fetchPolicy: "network-only"});
    const [onAddGroupHandler] = useMutation(ADDGROUPQUERY);
    const [onDeleteGroupHandler, {loading: deletingGroup}] = useMutation(DELETEGROUP);
    const [onAddItemHandler, {loading: addingItem}] = useMutation(ADDITEMQUERY);
    const [onDeleteItemHandler, {loading: deletingItem}] = useMutation(DELETEITEM);
    const [onUpdateTimeHandler, {loading: updatingTime}] = useMutation(UPDATETIMEQUERY)
    const [onUpdateTimeGroupHandler, {loading: updatingTimeAndGroup}] = useMutation(UPDATETIMEANDGROUPQUERY);

    /**
     * This function will add a group to the database.
     * @param {String} title Name of the group object
     */
    const addGroup = (title) => {
        onAddGroupHandler({
            variables: {title, project_id},
            optimisticResponse: true,
            // update: (cache, {data}) => {
            //     let existingData = cache.readQuery({query: GETPROJECTQUERY}, {variables: {id: project_id}})
            //     console.log(existingData);
            // }
        })
    };

    /**
     * Subscription to listen for any group that is added
     */
    const addGroupSubscription = () => {
        subscribeToMore({
            document: ADDGROUPSUBSCRIPTIONQUERY,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const newGroupItem = subscriptionData.data.groupAdded;
                const existingData = prev.project;
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: [...existingData.groups, newGroupItem],
                        items: existingData.items,
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        })
    };

    /**
     * Delete group function
     * @param {String} id ID of group to be deleted.
     */
    const deleteGroup = (id) => {
        onDeleteGroupHandler({
            variables: {id},
            optimisticResponse: true,
        })
    };

    /**
     * Subscription to listen for any deleted group.
     */
    const deleteGroupSubscription = () => {
        subscribeToMore({
            document: DELETEGROUPSUBSCRIPTIONQUERY,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const existingData = prev.project;
                const existingGroupData = [...prev.project.groups];
                const deletedGroupObject = subscriptionData.data.groupDeleted;
                let newGroupArray = existingGroupData.filter(group => group.id !== deletedGroupObject.id)
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: newGroupArray,
                        items: existingData.items,
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        })
    };

    /**
     * Add item to a specific group and project.
     * @param {String} title Title of item
     * @param {ID} group ID of group that item belongs to
     * @param {Number} start Unix timestamp
     * @param {Number} end Unix timestamp for ending
     * @param {String} className For future development
     * @param {String} bgColor Color of item's background
     * @param {Boolean} completed If true it is completed
     */
    const addItem = (title, group, start, end, className, bgColor, completed) => {
        onAddItemHandler({
            variables: {title, project_id, group, start, end, className, bgColor, completed},
            optimisticResponse: true
        })
    };

    /**
     * Item subscription for add.
     */
    const addItemSubscription = () => {
        subscribeToMore({
            document: ADDITEMSSUBSCRIPTIONQUERY,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const newItem = subscriptionData.data.itemAdded;
                const existingData = prev.project;
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: existingData.groups,
                        items: [...existingData.items, newItem],
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        })
    };

    /**
     * Delete item of id
     * @param {ID} id Item ID
     */
    const deleteItem = (id) => {
        onDeleteItemHandler({
            variables: {id},
            optimisticResponse: true
        })
    }

    /**
     * Item subscription for deleted item
     */
    const deleteItemSubscription = () => {
        subscribeToMore({
            document: DELETEITEMSSUBSCRIPTIONQUERY,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const existingData = prev.project;
                const existingItemData = [...prev.project.items];
                const deletedItemObject = subscriptionData.data.itemDeleted;
                let newItemArray = existingItemData.filter(items => items.id !== deletedItemObject.id)
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: existingData.groups,
                        items: newItemArray,
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        })
    }

    /**
     * Update the time in mongodb
     * @param {ID} id Item ID
     * @param {Number} start Item Start Time
     * @param {Number} end Item End Time
     */
    const updateTime = (id, start, end) => {
        onUpdateTimeHandler({
            variables: {id, start, end},
            optimisticResponse: true,
        })
    };

    /**
     * Time Subscription for any changes.
     */
    const updateTimeSubscription = () => {
        subscribeToMore({
            document: UPDATETIMESUBSCRIPTIONQUERY,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const existingData = prev.project;
                const existingItemData = [...existingData.items];
                const updatedItem = subscriptionData.data.updateTime;
                let newItemArray = existingItemData.filter(items => items.id !== updatedItem.id)
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: existingData.groups,
                        items: [updatedItem, ...newItemArray],
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        })
    };

    /**
     * Update time and Group
     * @param {ID} id Item ID
     * @param {Number} start Start time
     * @param {Number} end End Time
     * @param {String} group Group ID
     */
    const updateTimeAndGroup = (id, start, end, group) => {
        onUpdateTimeGroupHandler({
            variables: {id, start, end, group},
            optimisticResponse: true,
        })
    };

    const updateTimeAndGroupSubscription = () => {
        subscribeToMore({
            document: UPDATETIMEANDGROUPSUBSCRIPTION,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const existingData = prev.project;
                const existingItemData = [...existingData.items];
                const updatedItem = subscriptionData.data.updateTimeAndGroup;
                let newItemArray = existingItemData.filter(items => items.id !== updatedItem.id)
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: existingData.groups,
                        items: [updatedItem, ...newItemArray],
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        },
   )
    }

    const updateItemSubscription = () => {
        subscribeToMore(     {
            document: EDITITEMDETAILSUBSCRIPTION,
            variables: {id: project_id},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const existingData = prev.project;
                const existingItemData = [...existingData.items];
                const updatedItem = subscriptionData.data.updateItem;
                let newItemArray = existingItemData.filter(items => items.id !== updatedItem.id)
                return Object.assign({}, prev, {
                    project: {
                        created: existingData.created,
                        description: existingData.description,
                        groups: existingData.groups,
                        items: [updatedItem, ...newItemArray],
                        name: existingData.name,
                        __typename: existingData.__typename
                    }
                })
            }
        })
    }


    /**
     * Progress update of project
     * @param {Number} progress Progress of project
     */
    const progressUpdate = (progress) => {
        axios.post(process.env.REACT_APP_APIURL, {
            query: print(EDITPROJECTQUERY),
            variables: {id: project_id, progress}
        }).catch(err=> console.log(err))
    }
    
    /**
     * Loading Checks for UI circular progress.
     */
    const loadingChecks = () => {
        return (deletingGroup || addingItem || deletingItem || updatingTime || updatingTimeAndGroup)
    }

    /**
     * UI/UX updates
     */
    if (loading) return <div className="centered"><CircularProgress /></div>

    if (error) return <div>Error: {error.message}</div>

    if (data) { 
        return (
        <div style={loadingChecks() ? {pointerEvents: "none", opacity: "0.4"} : {}}>
            <Timeline
                key={project_id}
                name={data.project.name}
                items={data.project.items}
                groups={data.project.groups}
                addGroup={addGroup}
                addGroupSubscription={addGroupSubscription}
                deleteGroup={deleteGroup}
                addItem={addItem}
                deleteItem={deleteItem}
                deleteGroupSubscription={deleteGroupSubscription}
                addItemSubscription={addItemSubscription}
                deleteItemSubscription={deleteItemSubscription}
                updateTime={updateTime}
                updateTimeSubscription={updateTimeSubscription}
                updateTimeAndGroup={updateTimeAndGroup}
                updateTimeAndGroupSubscription={updateTimeAndGroupSubscription}
                updateItemSubscription={updateItemSubscription}
                progressUpdate={progressUpdate}
            />
            {loadingChecks() && <div className="centered"><CircularProgress /></div>}
            
        </div>
    )
    }
};