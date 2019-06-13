import React, {Component} from 'react';
import {scaleOrdinal} from 'd3-scale';
import {pie, arc} from 'd3-shape';
import {schemeCategory10} from 'd3-scale-chromatic';

const Arc = ({data, index, createArc, colors}) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors(index)} />
    <text
      transform={`translate(${createArc.centroid(data)})`}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
      fontSize="11"
    >
      {`${data.data[0]} ${(data.data[1] / 1000000).toFixed(2)}m`}
    </text>
  </g>
);

const Pie = props => {
  const createPie = pie()
    .value(d => d[1])
    .sort(null);
  const createArc = arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);
  const colors = scaleOrdinal(schemeCategory10);
  const data = createPie(props.data);

  return (
    <svg width={props.width} height={props.height}>
      <g transform={`translate(${props.outerRadius} ${props.outerRadius})`}>
        {data.map((d, i) => (
          <Arc
            key={i}
            data={d}
            index={i}
            createArc={createArc}
            colors={colors}
          />
        ))}
      </g>
    </svg>
  );
};

export default class PieChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      selectedCountry,
      whoData,
      height,
      width
    } = this.props;
    return (
      <div className={'pieChartContainer'}>
        <svg
          className={'pieChartSVG'}
          height={height}
          width={width}
        >
          <Pie
            innerRadius={width / 4}
            outerRadius={width / 2}
            height={height}
            width={width}
            data={whoData[selectedCountry]}
          />
        </svg>
      </div>
    );
  }
}
