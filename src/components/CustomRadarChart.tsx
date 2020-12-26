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
  Tooltip,
} from 'recharts'
import { RadarChartData } from '../interfaces/interfaces'

type Props = {
  userRecords: RadarChartData[]
  myColor: ColorResult
  rivalColor: ColorResult
}

export const CustomRadarChart: React.FC<Props> = ({
  userRecords,
  myColor,
  rivalColor,
}) => {
  return (
    <ResponsiveContainer height={400}>
      <RadarChart
        data={userRecords}
        margin={{ top: 0, right: 30, bottom: 0, left: 30 }}
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
          fillOpacity={0.8}
          animationEasing="ease-out"
        />
        <Radar
          name="Rival"
          dataKey="rivalPoint"
          stroke={rivalColor.hex}
          fill={rivalColor.hex}
          fillOpacity={0.4}
          animationEasing="ease-out"
        />
        <Tooltip cursor={false} offset={30} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
