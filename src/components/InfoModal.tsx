import React from 'react'
import { Modal } from 'antd'
import pointgraph from '../images/pointgraph.png'

export const InfoModal = (): void => {
  Modal.info({
    title: 'About',
    content: (
      <div>
        <h1>User Data</h1>
        <p>Official WCA competition results are fetched by WCA API v0.</p>
        <p>For each event, only single record is used.</p>
        <br></br>
        <h1>Point Calculation</h1>
        <p>Parameters</p>
        <ul>
          <li>WR: world record time(or score)</li>
          <li>AVG: assumed average time(or score) to get 50 points</li>
          <li>PB: personal best time(or score)</li>
        </ul>
        <p>If your time is better than AVG, you get score</p>
        <ul>
          <li>
            <b>50 + 50 * (AVG - PB) / (AVG - WR)</b>
          </li>
        </ul>
        <p>For MBLD, you get score</p>
        <ul>
          <li>
            <b>50 + 50 * (PB - AVG) / (WR - AVG)</b>
          </li>
        </ul>
        <p>If your time is not better than AVG, you get score</p>
        <ul>
          <li>
            <b>10 + 40 * AVG / PB</b>
          </li>
        </ul>
        <p>For MBLD, you get score</p>
        <ul>
          <li>
            <b>10 + 40 * PB / AVG</b>
          </li>
        </ul>
        <p>The point-time graph looks like this:</p>
        <img alt="point-time" src={pointgraph} width={500} />
        <p>
          Considering the appearance of radarchart, minimum point is set to 10.
        </p>
      </div>
    ),
    width: 800,
    maskClosable: true,
  })
}
