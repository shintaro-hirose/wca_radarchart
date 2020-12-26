import { Button } from 'antd'
import React from 'react'
import pointgraph from '../images/pointgraph.png'
import { GithubOutlined, TwitterOutlined } from '@ant-design/icons'

export const Description: React.FC = () => {
  return (
    <div className="description">
      <h1>User Data</h1>
      <p>Official WCA competition results are fetched by WCA API v0.</p>
      <p>For each event, only single record is used.</p>
      <br />
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
      <img alt="point-time" src={pointgraph} width="100%" />
      <br />
      <p>
        Considering the appearance of radarchart, minimum point is set to 10.
      </p>
      <br />
      <h1>Contact</h1>
      <p>
        You have any fun idea or suggestion? Then contact me at{' '}
        <a
          href="https://github.com/shintaro-hirose/wca_radarchart"
          rel="noreferrer"
          target="_blank"
        >
          Github Repository
        </a>
        .
      </p>
      <p>
        Feel free to make issues or Pull Requests, and don&apos;t forget to Star
        repository if you liked!
      </p>
      <p>
        Also contact me on{' '}
        <a href="https://twitter.com/home" rel="noreferrer" target="_blank">
          Twitter
        </a>
        .
      </p>
      <div className="icons">
        <Button
          href="https://github.com/shintaro-hirose/wca_radarchart"
          rel="noreferrer"
          target="_blank"
          shape="circle"
          size="large"
          style={{ color: 'white', backgroundColor: 'black', margin: '20px' }}
        >
          <GithubOutlined />
        </Button>
        <Button
          href="https://twitter.com/home"
          rel="noreferrer"
          target="_blank"
          shape="circle"
          size="large"
          style={{ color: 'white', backgroundColor: '#1DA1F2', margin: '20px' }}
        >
          <TwitterOutlined />
        </Button>
      </div>
    </div>
  )
}
