import React from 'react'
import { ColorResult } from 'react-color'
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { RadarChartData } from '../containers/Home'

type Props = {
  userRecords: RadarChartData[]
  myColor: ColorResult
  rivalColor: ColorResult
}

const MyRadarChart: React.FC<Props> = ({
  userRecords,
  myColor,
  rivalColor,
}) => {
  return (
    <ResponsiveContainer width="100%">
      <RadarChart
        data={userRecords}
        // margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="eventName" />
        <PolarRadiusAxis
          angle={90 - 360 / userRecords.length}
          domain={[0, 100]}
        />
        <Radar
          name="You"
          dataKey="myPoint"
          stroke={myColor.hex}
          fill={myColor.hex}
          fillOpacity={myColor.rgb.a}
          animationEasing="ease-out"
        />
        <Radar
          name="Rival"
          dataKey="rivalPoint"
          stroke={rivalColor.hex}
          fill={rivalColor.hex}
          fillOpacity={rivalColor.rgb.a}
          animationEasing="ease-out"
        />

        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
export default MyRadarChart
