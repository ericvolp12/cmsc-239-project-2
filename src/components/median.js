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

    const medians = data.medians;
    const medObj = this.generateMedObj(height, width, medians);
    this.state = {
      valence: false,
      liveness: false,
      acousticness: false,
      energy: false,
      danceability: false,
      medObj
    };
  }

  componentDidMount() {
    this.renderAxis(this.state.medObj);
  }

  generateMedObj(height, width, medians) {
    const xScale = scaleLinear()
    .domain([min(Object.values(medians)) - 0.05, max(Object.values(medians))])
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
      medObj
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
    const medObjs = this.generateMedObj(height, width, medians);
    this.renderAxis(medObjs);
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
