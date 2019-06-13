import React, {Component} from 'react';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {min, max} from 'd3-array';
import {select} from 'd3-selection';
import {getMedians} from './../utils';

export default class Median extends Component {
  constructor(props) {
    super(props);

    const {
      height,
      width,
      data
    } = props;
    const spotifyMedians = {
      valence: 0.38,
      liveness: 0.11,
      acousticness: 0.11,
      energy: 0.8,
      danceability: 0.64
    };
    const medians = data.medians;
    const medObj = this.generateMedObj(height, width, medians, spotifyMedians);
    this.state = {
      valence: false,
      liveness: false,
      acousticness: false,
      energy: false,
      danceability: false,
      medObj,
      spotifyMedians
    };
  }

  componentDidMount() {
    this.renderAxis(this.state.medObj);
  }

  generateMedObj(height, width, medians, spotifyMedians) {
    console.log(Math.min(min(Object.values(spotifyMedians)), min(Object.values(medians)) - 0.05));
    console.log(Math.max(max(Object.values(spotifyMedians)), max(Object.values(medians))));
    console.log(Object.values(spotifyMedians), Object.values(medians));
    const xScale = scaleLinear()
    .domain([Math.min(min(Object.values(spotifyMedians)), min(Object.values(medians)) - 0.05),
      Math.max(max(Object.values(spotifyMedians)), max(Object.values(medians)))])
    .range([0, width - 100]);
    const yScale = scaleBand()
    .domain(Object.keys(medians))
    .range([0, height - 50]);
    const medianArray = Object.keys(medians).reduce((res, d) => {
      res.push({name: d, value: medians[d]});
      return res;
    }, []);
    return {xScale, yScale, medianArray};
  }
  changeSelectedValues(e) {
    const target = e.target;
    this.setState({[`${target.value}`]: target.checked});
  }

  renderAxis(newMedObj) {
    select(this.songFrequencyElement).call(axisG =>
      axisG.call(axisBottom(newMedObj.xScale)));
    select(this.bucketsElement).call(axisG =>
      axisG.call(axisLeft(newMedObj.yScale)));
  }

  render() {
    const {
      medObj,
      spotifyMedians
    } = this.state;
    const {
      height,
      width,
      traits,
      data
    } = this.props;
    const selectedSongs = data.songs.reduce((res, d) => {
      if (d.selected) {
        res.push(d);
      }
      return res;
    }, []);
    const medians = getMedians(selectedSongs, traits);
    const medObjs = this.generateMedObj(height, width, medians, spotifyMedians);
    this.renderAxis(medObjs);
    const spotifyMedianArray = [
      {name: 'valence', value: 0.38},
      {name: 'liveness', value: 0.11},
      {name: 'acousticness', value: 0.11},
      {name: 'energy', value: 0.8},
      {name: 'danceability', value: 0.64}
    ];
    return (
      <div>
        <div className="median-heading">
          <h1>Median Bar Chart Component</h1>
        </div>
        <div className="median">
          <div className="median-chart">
            <svg className="median-svg" height={height} width={width} transform={'translate(20, 15)'}>
              <g
                  ref={(el) => {
                    this.songFrequencyElement = el;
                  }}
                  transform={`translate(80, ${height - 25})`}/>
                {/* recalculate medians after each rerender!!! */}
              {medObjs ? medObjs.medianArray.map((feature, idx) => {
                return this.state[feature.name] ?
                  <rect
                    key={`median_${idx}`}
                    height={medObj.yScale.bandwidth()}
                    width={medObj.xScale(feature.value)}
                    y={medObj.yScale(feature.name)}
                    fill={data.scales[feature.name](data.medians[feature.name])}
                    transform={'translate(80, 25)'} /> :
                    null;
              }) : null}
              {spotifyMedians ? spotifyMedianArray.map((feature, idx) => {
                return this.state[feature.name] ?
                  <line
                    key={`spotifyMedian_${idx}`}
                    x1={medObj.xScale(feature.value)}
                    x2={medObj.xScale(feature.value)}
                    y1={medObj.yScale(feature.name)}
                    y2={medObj.yScale(feature.name) + medObj.yScale.bandwidth()}
                    transform={'translate(80, 25)'}
                    stroke="#000000"
                    strokeWidth="5" /> : null;
              }) : null}
              <g
                ref={(el) => {
                  this.bucketsElement = el;
                }}
                transform={'translate(80, 25)'}/>
            </svg>
          </div>
          <div className="median-checklist">
            <form onChange={(e) => this.changeSelectedValues(e)}>
              <input type="checkbox" name="feature" value="valence"/>Valence<br/>
              <input type="checkbox" name="feature" value="liveness"/>Liveness<br/>
              <input type="checkbox" name="feature" value="acousticness"/>Acousticness<br/>
              <input type="checkbox" name="feature" value="energy"/>Energy<br/>
              <input type="checkbox" name="feature" value="danceability"/>Danceability<br/>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
