import React from 'react'
import {Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

type Props = {
    userRecords: object[];
}

const MyRadarChart: React.FC<Props> = ({userRecords}) => {
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
            stroke="blue" 
            fill="blue"
            fillOpacity={0.5} 
            animationEasing="ease-out"/>
            <Radar 
            name="You" 
            dataKey="myPoint" 
            stroke="red" 
            fill="red"
            fillOpacity={0.5} 
            animationEasing="ease-out"/>
            <Legend />
        </RadarChart>
    )
}
export default MyRadarChart;