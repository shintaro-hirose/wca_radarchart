import React from 'react'
import { RGBColor } from 'react-color';
import {Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

type Props = {
    userRecords: object[];
    myColor: [string, RGBColor]
    rivalColor: [string, RGBColor]
}

const MyRadarChart: React.FC<Props> = ({userRecords, myColor, rivalColor}) => {
    return (
        <RadarChart 
        outerRadius={90} 
        width={730} 
        height={250} 
        data={userRecords}
        >
            <PolarGrid />
            <PolarAngleAxis dataKey="eventName" />
            <PolarRadiusAxis angle={90 - 360/userRecords.length} domain={[0, 100]} />
            <Radar 
            name="Rival" 
            dataKey="rivalPoint" 
            stroke={rivalColor[0]}
            fill={rivalColor[0]}
            fillOpacity={rivalColor[1].a} 
            animationEasing="ease-out"/>
            <Radar 
            name="You" 
            dataKey="myPoint" 
            stroke={myColor[0]}
            fill={myColor[0]}
            fillOpacity={myColor[1].a} 
            animationEasing="ease-out"/>
            <Legend />
        </RadarChart>
    )
}
export default MyRadarChart;