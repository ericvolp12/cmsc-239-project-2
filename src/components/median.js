import React, {Component} from 'react';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {min, max} from 'd3-array';
import {select} from 'd3-selection';

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
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  generateMedObj(height, width, medians) {
    const xScale = scaleLinear()
    .domain([min(Object.values(medians)) - 0.05, max(Object.values(medians))])
    .range([0, width - 100]);
    const yScale = scaleBand()
    .domain(Object.keys(medians))
    .range([0, height - 50]);
    return {xScale, yScale};
  }
  changeSelectedValues(e) {
    const target = e.target;
    this.setState({[`${target.value}`]: target.checked});
  }

  renderAxis() {
    select(this.songFrequencyElement).call(axisG =>
      axisG.call(axisBottom(this.state.medObj.xScale)));
    select(this.bucketsElement).call(axisG =>
      axisG.call(axisLeft(this.state.medObj.yScale)));
  }

  render() {
    const {
      medObj
    } = this.state
    const {
      height,
      width,
      data
    } = this.props;

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
              {data ? data.mediansArray.map((feature, idx) => {
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
