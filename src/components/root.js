import React from 'react';
import {prepareData} from './../prepareData';
import Waterfall from './waterfall';
import Feature from './feature';
import Median from './median';
import WhoComponent from './who';

class RootComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoaded: false,
      songs: null,
      data: null,
      metaProps: ['name', 'artists', 'id'],
      traits: ['danceability', 'energy', 'acousticness', 'liveness', 'valence'],
      scales: null,
      whoData: null
    };
  }

  componentWillMount() {
    prepareData('./data/songs.csv', this.state.metaProps, this.state.traits).then((res) => this.setState({
      isLoaded: true,
      data: res,
      songs: res.songs.map((v) => {
        v.selected = true;
        return v;
      }),
      scales: res.scales,
      whoData: {
        us: [
          ['Post Malone', 39699916],
          ['Kendrick Lamar', 21223395],
          ['G-Eazy', 19889476],
          ['Migos', 17442167],
          ['Lil Uzi Vert', 17397323]
        ]
      }
    }));
  }
  selectSong(index) {
    const songs = this.state.songs;
    songs[index].selected = true;
    this.setState({songs});
  }

  deselectSong(index) {
    const songs = this.state.songs;
    songs[index].selected = false;
    this.setState({songs});
  }

  render() {
    return (
      <div className="relative">
        {this.state.data ?
          <Waterfall
            songs={this.state.songs}
            selectSong={index => this.selectSong(index)}
            deselectSong={index => this.deselectSong(index)}
            traits={this.state.traits}
            scales={this.state.scales}
            height={1500}
            width={800}
          /> : null }
        {this.state.data ?
          <Feature
            data={this.state.data}
            songs={this.state.songs}
            height={500}
            width={800}
            traits={this.state.traits}
          /> : null }
        <Median data={this.state.data} selectedSongs={this.state.selectedSongs}/>
        <WhoComponent whoData={this.state.whoData} />
        </div>
    );
  }
}

RootComponent.displayName = 'RootComponent';
export default RootComponent;
