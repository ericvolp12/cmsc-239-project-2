import React, {Component} from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto'
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.World = require('./../static/top-five.json');
    this.map = require('./../static/world-50m.json');
  }

  handleClick(e) {
    if (Object.keys(this.World).includes(e.id)) {
      this.props.click(e.id);
    }
  }

  selected(id) {
    if (Object.keys(this.World).includes(id)) {
      return 'teal';
    }
    return '#ECEFF1';

  }

  render() {

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0]
          }}
          width={980}
          height={551}
          style={{
            width: '100%',
            height: 'auto'
          }}
        >
          <ZoomableGroup center={[0, 20]} disablePanning>
            <Geographies geography={this.map}>
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== 'ATA' &&
              this.props && (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: this.selected(geography.id),
                      stroke: '#607D8B',
                      strokeWidth: 0.75,
                      outline: 'none'
                    },
                    hover: {
                      fill: 'yellow',
                      stroke: '#607D8B',
                      strokeWidth: 0.75,
                      outline: 'black'
                    },
                    pressed: {
                      fill: 'yellow',
                      stroke: '#607D8B',
                      strokeWidth: 0.75,
                      outline: 'none'
                    }
                  }}
                  onClick={this.handleClick.bind(this)}
                />
              ))}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default Map;
