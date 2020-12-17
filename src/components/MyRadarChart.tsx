import React from 'react'
import {Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

type Props = {
    userRecords: any[];
}

const MyRadarChart: React.FC<Props> = ({userRecords}) => {
    return (
        <RadarChart outerRadius={90} width={730} height={250} data={userRecords} >
            <PolarGrid />
            <PolarAngleAxis dataKey="eventName" />
            <Radar name="You" dataKey="point" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            {/* <Radar name="Rival" dataKey="point2" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} /> */}
            <Legend />
        </RadarChart>
    )
}
export default MyRadarChart;