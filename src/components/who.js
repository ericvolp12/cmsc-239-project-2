import React from 'react';
import PieChart from './piechart';
import Map from './map';
// import World from './data/world-data';

export default class WhoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCountry: 'USA'
    };
    this.World = require('./../static/top-five.json');

  }

  render() {
    return (
      <div className="relative">
        {this.state.selectedCountry ?
          <PieChart
            selectedCountry={this.state.selectedCountry}
            whoData={this.World}
            height={400}
            width={400}
          /> : null
        }
        <Map data={this.World} selectedCountry={this.state.selectedCountry}
             click={country => this.setState({selectedCountry: country})}/>
      </div>
    );
  }
}
