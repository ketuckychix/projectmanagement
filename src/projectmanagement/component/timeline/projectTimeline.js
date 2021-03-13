import React from 'react';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment';
import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container';
import TodayLine from './timelinemarkers';
import randomColor from 'randomcolor';
import '../style.css';
import InfoLabel from './InfoLabel'
import ItemView from './itemview';
import {deepEqual, hexWithAlpha, deadlineIn3Days} from '../../../helpers/helpers';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import { green, grey, yellow } from '@material-ui/core/colors';

var keys = {
    groupIdKey: "id",
    groupTitleKey: "title",
    groupRightTitleKey: "rightTitle",
    itemIdKey: "id",
    itemTitleKey: "title",
    itemDivTitleKey: "title",
    itemGroupKey: "group",
    itemTimeStartKey: "start",
    itemTimeEndKey: "end",
    groupLabelKey: "title"
  };

class TimeLine extends React.Component {
    constructor(props){
        super(props)
        const name = this.props.name
        const defaultTimeStart = moment()
            .startOf('day')
            .toDate()
        const defaultTimeEnd = moment()
            .startOf('day')
            .add(7, 'day')
            .toDate()
        this.state = {
            name,
            items: this.props.items,
            defaultTimeStart,
            defaultTimeEnd,
            draggedItem: undefined,
            selected: undefined,
            groupValue: "",
            itemView: false,
            itemContent: {}
        };

        this.onCanvasDoubleClick = this.onCanvasDoubleClick.bind(this);
        this.submitGroup = this.submitGroup.bind(this);
        this.handleGroupInputChange = this.handleGroupInputChange.bind(this);
        this.onCanvasContextMenu = this.onCanvasContextMenu.bind(this);
        this.toggleItemView = this.toggleItemView.bind(this);
    }

    handleItemMove = (itemId, dragTime, newGroupOrder) => {
        const { items, groups } = this.props;
    
        let itemsArray = items.filter(item => item.id === itemId);
        let item = itemsArray[0]
        let endTime = dragTime + (item.end - item.start);
        let groupId = groups[newGroupOrder].id
        this.props.updateTimeAndGroup(itemId, dragTime, endTime, groupId)


        this.setState({
          draggedItem: undefined
        });

    };

    handleItemResize = (itemId, time, edge) => {
        const { items } = this.props;
        //Retrieve everything then set the start value:
        let itemsArray = items.filter(item => item.id === itemId);
        let item = itemsArray[0]
        if (edge === "left") {
          let startValue = (time >= item.end ? item.start : time)
          let endValue = (item.end)
          this.props.updateTime(itemId, startValue, endValue)
        } else {
          let startValue = item.start
          let endValue = (time <= item.start ? item.end : time)
          this.props.updateTime(itemId, startValue, endValue)
        }
        this.setState({
          draggedItem: undefined
        });

    };

    handleItemDrag = ({ eventType, itemId, time, edge, newGroupOrder }) => {
        let item = this.state.draggedItem ? this.state.draggedItem.item : undefined;
        if (!item) {
          item = this.props.items.find(i => i.id === itemId);
        }
        this.setState({
          draggedItem: { item: item, group: this.props.groups[newGroupOrder], time }
        });
    };

    componentDidMount() {
      this.props.addGroupSubscription();
      this.props.deleteGroupSubscription();
      this.props.addItemSubscription();
      this.props.deleteItemSubscription();
      this.props.updateTimeSubscription();
      this.props.updateTimeAndGroupSubscription();
      this.props.updateItemSubscription();
    };

    itemRenderer = ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
        const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
        return (

          <div {...getItemProps({
              style: {background: hexWithAlpha(item.bgColor), color: grey[900]} ,
              onContextMenu: (e) => {
                  e.preventDefault();
                  var deleteConfirmation = window.confirm(`Are you sure you want to delete the task:\n "${item.title}" ?`)
                  if (deleteConfirmation === true) {
                    this.props.deleteItem(item.id);
                  }
              }
            })} >
            {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
            
            <div>
            <div
              style={{
                height: itemContext.dimensions.height,
                overflow: "hidden",
                paddingLeft: 3,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
             {item.completed ? <DoneIcon style={{ color: green["A400"]}}/> : (deadlineIn3Days(item.end) ? <WarningIcon style={{color: yellow[700]}}/> : null)} 
             {item.title}
            </div>
            </div>
         
    
            {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
          </div>
        );
    };

    //Adds an item to the timeline.
    async onCanvasDoubleClick(group, time, e) {
        e.preventDefault();
        if (group === undefined) {
          alert("You need to add a person first! :)");
          return
        } else {
          let randomSeed = Math.floor(Math.random() * 1000);
          const oneDayinMS = 24 * 60 * 60 * 1000;
          const title = "new title";
          let end = time + oneDayinMS;
          let className = moment(time).day() === 6 || moment(time).day() === 0
          ? "item-weekend"
          : "";
          let bgColor = randomColor({
              luminosity: "light",
              seed: randomSeed,
              format: "hex",
              alpha: 0.6
          });
          let completed = false;
          this.props.addItem(title, group, time, end, className, bgColor, completed)
        }
    };

    //Delete the group on right click;
    onCanvasContextMenu(groupId, time, e){
        e.preventDefault();
        //1. Check if the group is < 1 or none;
        if (this.props.groups.length <= 1) {
            alert("Please add a person first before deleting...")
        } else {
          //Get title
          let groupClone = [...this.props.groups];
          let groupObject = groupClone.find(i => i.id === groupId)
          var deleteConfirmation = prompt(`Are you sure you want to delete ${groupObject.title}? \n To confirm, please enter "${groupObject.title}" to delete.`)
          if (deleteConfirmation === groupObject.title) {
              //Perform the mutation
              this.props.deleteGroup(groupId);
          } else {
            alert("Please re-enter the correct response.")
          }
        }
    }


    //Add a group (person) to the timeline.
    submitGroup(e) {
        e.preventDefault();
        if (this.state.groupValue === "") {
          alert('Please enter a name')
          return
        } else {
            this.props.addGroup(this.state.groupValue);
            this.setState({
              groupValue : ""
            })
        }
    
    };

    handleGroupInputChange(e) {
        this.setState({
            groupValue: e.target.value
        })
    };

    onItemDoubleClick = (itemId, e, time) => {
        this.toggleItemView();
        //Get items
        const {items} = this.props
        //Get item objects through id
        const itemObject = items.filter(item => item.id === itemId)
        this.setState({
          itemContent: itemObject[0]
        })
    };

    toggleItemView() {
      this.setState({
        itemView: !this.state.itemView
      }, () => {
        if (this.state.itemView === false) {
          //Set itemComment to empty object
          this.setState({
            itemContent: {}
          })
        }
      })

    }

    componentDidUpdate() {
      let stateItems = [...this.state.items];
      let propsItems = [...this.props.items];
      //Check
      if (stateItems.length !== propsItems.length) {
              let total = this.props.items.length;
              let completed = this.props.items.filter(item => item.completed === true).length;
              let progress = completed/total * 100;
              this.props.progressUpdate(progress);
      } else if (stateItems.length === propsItems.length) {
        //Check the objects within; deep check.
        var i=0;
        while (i < stateItems.length) {
          if (!deepEqual(stateItems[i], propsItems[i])) {
              let total = this.props.items.length;
              let completed = this.props.items.filter(item => item.completed === true).length;
              let progress = completed/total * 100;
              this.props.progressUpdate(progress)
              break
          }
          i++
        }
      }
    }


    render() {
        const {name, defaultTimeEnd, defaultTimeStart, draggedItem, itemView} = this.state;
        const {groups, items} = this.props;

        return (
            <div>
               
                    <div className="contents">
                    <React.Fragment>
                        {/* <h1 className="project-name">  {name}</h1> */}
                        <Timeline
                              style={itemView ? {pointerEvents: "none", opacity: "0.4"} : {}}
                              items={items} 
                              groups={(groups.length === 0) ? [{}] : groups} 
                              defaultTimeStart={defaultTimeStart}
                              defaultTimeEnd={defaultTimeEnd} 
                              keys={keys}
                              canMove={true}
                              canResize={"both"}
                              onItemMove={this.handleItemMove}
                              onItemResize={this.handleItemResize}
                              onItemDrag={this.handleItemDrag}
                              itemsSorted
                              fullUpdate
                              itemTouchSendsClick={false}
                              stackItems
                              itemHeightRatio={0.75}
                              sidebarWidth={160}
                              lineHeight={50}
                              itemRenderer={this.itemRenderer}
                              minZoom={4*60*60*1000}
                              resizeDetector={containerResizeDetector}
                              canChangeGroup={true}
                              onCanvasDoubleClick={this.onCanvasDoubleClick}
                              onCanvasContextMenu={this.onCanvasContextMenu}
                              onItemDoubleClick={this.onItemDoubleClick} >
                                <TodayLine />
                            <TimelineHeaders className="sticky" style={{backgroundColor: "rgba(178, 190, 195,1.0)"}}>
                            <SidebarHeader>
                                {({ getRootProps }) => {
                                    return <div {...getRootProps()}><p style={{textAlign:'center', color: 'black'}}>People</p></div>;
                                }}
                            </SidebarHeader>
                            <DateHeader unit="primaryHeader" />
                            <DateHeader height={50}/>
                            </TimelineHeaders>
                      </Timeline>
                        <div>
                            <form onSubmit={(e) => this.submitGroup(e)} >
                                <input 
                                    style={{width:150}} 
                                    type="text" 
                                    value={this.state.groupValue}
                                    onChange={this.handleGroupInputChange} />
                            </form>   
                        </div>
                        {draggedItem && (
                <InfoLabel
                  item={draggedItem.item}
                  group={draggedItem.group}
                  time={draggedItem.time}
                />
              )}
              {
                itemView && <ItemView close={() => this.toggleItemView} content={this.state.itemContent} />
              }
                    </React.Fragment>
                    </div>
                
            </div>
        )
    }
}

export default TimeLine