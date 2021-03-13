import React from 'react';
import {TimelineMarkers, TodayMarker} from 'react-calendar-timeline';

export default function TodayLine(props) {
    return (
        <TimelineMarkers>
        <TodayMarker interval={2000}>
          {({styles, date}) =>
            {styles = {...styles, backgroundColor: 'black'}
            return (
            <div style={styles} />)}
        }
        </TodayMarker>
      </TimelineMarkers>
    )
}