import React, {Component} from 'react';
import {scaleLinear} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {histogram, min, max} from 'd3-array';
import {select} from 'd3-selection';

export default class Feature extends Component {
  constructor(props) {
    super(props);
    const {
      height,
      width,
      traits,
      songs
    } = props;
    const selectedValue = 'valence';

    const histObjs = this.generateHistObjs(height, width, traits, songs, selectedValue);

    const histObj = histObjs[selectedValue];
    this.state = {
      selectedValue,
      histObj
    };
  }

  componentDidMount() {
    this.renderAxis(this.state.histObj);
  }

  generateHistObjs(height, width, traits, songs, selectedValue) {
    const selectedSongs = songs.reduce((res, d) => {
      if (d.selected) {
        res.push(d);
      }
      return res;
    }, []);
    const histObjs = traits.reduce((acc, trait) => {
      const retVal = {};
      const traitValues = selectedSongs.map((v) => v[trait]);
      retVal.yScale = scaleLinear()
        .domain([min(traitValues), max(traitValues)])
        .range([height - 25, 0]);
      retVal.histData = histogram()
      .domain(retVal.yScale.domain())
      .thresholds(retVal.yScale.ticks(5))(traitValues);
      retVal.xScale = scaleLinear()
        .domain([0, max(retVal.histData, function getLength(d) {
          return d.length;
        })])
        .range([0, width - 100]);
      retVal.xAxis = axisBottom(retVal.xScale);
      retVal.yAxis = axisLeft(retVal.yScale);
      acc[trait] = retVal;
      return acc;
    }, {});
    return histObjs;
  }

  renderAxis(histObj) {
    select(this.songFrequencyElement).call(axisG => axisG.call(histObj.xAxis));
    select(this.bucketsElement).call(axisG => axisG.call(histObj.yAxis));
  }

  changeSelectedValue(e) {
    this.setState({selectedValue: e.target.value});
  }

  render() {
    const {
      height,
      width,
      data,
      traits,
      songs
    } = this.props;
    const {
      selectedValue
    } = this.state;
    const histObjs = this.generateHistObjs(height, width, traits, songs, selectedValue);
    const histObj = histObjs[selectedValue];
    this.renderAxis(histObj);

    return (
      <div>
        <div className="feature">
          <div className="feature-dropdown">
            <select onChange={(e) => this.changeSelectedValue(e)}>
              <option value="valence">Valence</option>
              <option value="liveness">Liveness</option>
              <option value="acousticness">Acousticness</option>
              <option value="energy">Energy</option>
              <option value="danceability">Danceability</option>
            </select>
          </div>
          <div className="feature-chart">
            <svg className="feature-svg" height={height} width={width} transform={'translate(20, 15)'}>
              <g
                ref={(el) => {
                  this.songFrequencyElement = el;
                }}
                transform={`translate(80, ${height - 25})`}/>
              {histObj.histData ? histObj.histData.map((bucket, idx) => {
                return (
                  <rect
                    key={`feature_${idx}`}
                    height={histObj.yScale(bucket.x0) - histObj.yScale(bucket.x1)}
                    width={histObj.xScale(bucket.length)}
                    x={80}
                    y={histObj.yScale(bucket.x1)}
                    fill={data.scales[selectedValue](((bucket.x1 - bucket.x0) / 2) + bucket.x0)} />
                );
              }) : null}
              <g
                ref={(el) => {
                  this.bucketsElement = el;
                }}
                transform={'translate(80)'}/>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
