<h1><a href="https://wca-radarchart.firebaseapp.com/" rel="norefferer" target="_blank">wca-radarchart</a></h1>

<img width="600" alt="スクリーンショット 2020-12-26 16 38 31" src="https://user-images.githubusercontent.com/48212107/103147462-dd664400-4798-11eb-8262-b850e244e995.png">

<h2>User Data</h2>
      <p>Official WCA competition results are fetched by WCA API v0.</p>
      <p>Check out <a href="https://github.com/thewca/worldcubeassociation.org/commit/cf1b6f4f8dfa168c260fd1fab7e2e7c7889311bb" rel="norefferer" target="_blank">WCA org Github wiki</a> about WCA API.</p>
      <p>For each event, only single record is used.</p>
      <br />
      <h2>Point Calculation</h2>
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
      <p>
        Considering the appearance of radarchart, minimum point is set to 10.
      </p>
      </p>
