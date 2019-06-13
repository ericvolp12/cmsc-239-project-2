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
      scales: res.scales

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
      <div className="relative" align="center">
        <div className="text-block">
          <div className="title" align="center">
            What Made a Popular Song in 2018?
          </div>
          <div className="subtitle">
            Spotify is the largest music streaming service in the world (not including YouTube), and as such,
            offers insight into worldwide music trends over time. While many people search for specific songs
            or artists through Spotify, others use it as a discovery service with various personalized “radio”
            stations that permit them to find new artists and albums in which they might be interested.
            In order to facilitate the personalization of music discovery services, Spotify generates
            artificial measures of various traits of songs such as “danceability”, “accousticness”,
            and “energy”. A user’s preference list is then built based on the music they choose to
            explicitly listen to, mapping a profile of musical traits for those songs and artists, and
            recommendations attempt to match the feeling of those songs.
          </div>
          <div className="subtitle">
            To get a better look at trends between synthetic Spotify traits and popularity in songs around the
            world, we’ve chosen to break down the Spotify Top 100 list from 2018 and explore relationships in
            the traits of songs on the list. This visualization is interactive, so feel free to select and
            deselect different songs to see how the data summaries change. Later, we’ll explore worldwide
            popular artist trends with a more exhaustive dataset, again from 2018.
          </div>
        </div>
        <div className="text-block">
          <div className="title" align="center">
            The Waterfall
          </div>
          <div className="subtitle">
            To visualize the entire dataset, there are a handful of approaches that could provide visibility
            to different aspects in the data. In order to emphasize 5 traits, “valence”, “liveness”,
            “acousticness”, “energy”, and “danceability”, an interpolated color scale provides a visually
            stunning and yet detailed overview of the data. In the waterfall, you can observe each trait for
            the top 100 songs, in which we can clearly see a large variation in valence, the measure of
            positive or negative emotion associated with a song. The liveness column is rather polarized,
            as most of these tracks were not recorded from live performances, and nothing that is well
            categorized should fall in the middle. Acousticness also has a similar polarization, with many
            tracks showing very little green, denoting a more electronic and artificial sounding track.
            Energy seems to run high across the distribution, strips of deep red are prevalent in this column.
            Finally we can see danceability at a high average as well with the blue strip nearly continuous
            through the waterfall.
          </div>
          <div className="subtitle">
          To help with the later visualizations, we’ve given you the ability to enable or disable particular
          tracks in the waterfall and thus include or disclude them from the dataset. A discluded song will
          appear as a black bar on the waterfall. Let’s see if our predictions hold up when held to the
          scrutiny of trait histograms.
          </div>
        </div>
        {this.state.data ?
          <Waterfall
            songs={this.state.songs}
            selectSong={index => this.selectSong(index)}
            deselectSong={index => this.deselectSong(index)}
            traits={this.state.traits}
            scales={this.state.scales}
            height={1500}
            width={1000}
          /> : null }
        <div className="text-block">
          <div className="title" align="center">
            Trait Distributions
          </div>
          <div className="subtitle">
            In the trait histogram section, we see some interesting visualizations of each individual trait,
            where we can select the trait we want to inspect using the dropdown menu. We gain some insight
            into the distribution of each trait across the top 100 song dataset. What we find in the valence
            distribution, is a fairly normal looking distribution with a peak in the middle bucket from 0.4
            to 0.6 valence. As we observed in the waterfall, we now get a more specific description of how
            the data fall. The liveness distribution appears polarized as we expected, but it seems it falls
            much more heavily on the less-live side of the scale near 0. Acousticness seems weighted toward
            0 as well, with a diminishing number of tracks included in buckets the higher we get. Energy is
            weighted much more heavily to 1 than 0, clearly showing that our top 100 songs are fairly high
            energy. Finally, danceability falls with the largest bucket between 0.7 and 0.8, expressing the
            high danceability of most songs in the dataset, with a small spike in the 0.3 to 0 bucket.
          </div>
          <div className="subtitle">
            So, what have we learned from an inspection of the frequency distribution of traits in our top
            100 songs? Clearly these popular songs lean more heavily on the high-danceability and high-energy
            side, they’re not very acoustic but a few tracks manage a very high acoustic rating, most are
            not recorded live, and the mood of each song (as described by valence) varies from high to low.
            The strong signals of high energy and danceability don’t seem to have much to do with the mood
            of a top song.
          </div>
        </div>
        {this.state.data ?
          <Feature
            data={this.state.data}
            songs={this.state.songs}
            height={500}
            width={1000}
            traits={this.state.traits}
          /> : null }
        <div className="text-block">
          <div className="title" align="center">
            Trait Medians (2018 vs Spotify Overall)
          </div>
          <div className="subtitle">
            The median bar chart component aims to give us some general sense of how the audio features for
            the top 100 songs of 2018 compared to the rest of the songs accessible on Spotify’s library API.
            Each of the five different audio features can be selected from a checklist, which will then
            render the audio feature’s median value among the top 100 songs of 2018 (represented as a
            colored bar), as well as the median value among all songs available on Spotify (represented
            as a black bar).
          </div>
          <div className="subtitle">
            Looking at the visualization, we can see that “liveness” and “acousticness” of the top 100
            songs match closely to most songs on Spotify. We attribute this to the reliance upon electronic
            music production and post-production techniques in the 21st century. We can also see that the
            median “danceability” and “valence” values for the top 100 songs are much higher than most songs
            on Spotify. This suggests high “danceability” and “valence”, which is indicative of a song’s
            “positivity”, may influence popularity. One interesting point in our data is that the median
            value for “energy” in the top 100 songs are much lower than that of the rest of the songs on
            Spotify. Since “energy” is a “perceptual measure of intensity and activity,” this suggests
            that popular songs may not always be fast, loud, and noisy.
          </div>
        </div>
        {this.state.data ?
          <Median
            data={this.state.data}
            traits={this.state.traits}
            height={500}
            width={1000}
          /> : null }
        <div className="text-block">
          <div className="title" align="center">
            Who Was Listening to Whom in 2018?
          </div>
          <div className="subtitle">
            The following map component gives us a chance to view the most popular artists in some
            countries around the world. By clicking on each available country (colored turquoise)
            on the map, the pie chart changes to reflect the most streamed top five artists (as well
            as their number of streams).
          </div>
          <div className="subtitle">
            The data gives some very interesting insights into which artists are popular in
            each geographic region. For example, Post Malone consistently places in the top
            five in English speaking countries regardless of continent (e.g. the U.S., Canada,
            U.K., Australia), whereas he is nowhere to be found in the top five in any non-English
            speaking country. The same cannot be said for Ed Sheeran, who places rather frequently
            in the top five not only in English speaking countries, but also in countries like
            Costa Rica, Japan, Indonesia, and the Philippines. Why one English speaking artist
            appears only appears in the top five in English speaking countries, while another
            English speaking artist appears in the top five in non-English speaking countries
            as well is an open question. It could be due to differences in song topics (i.e.
            beer bottles &amp; bongs vs. melancholy heartbreak), or something more cheeky… perhaps,
            “danceability” or “valence”?
          </div>
        </div>
        <WhoComponent />
        <div className="text-block">
          <div className="title" align="center">
            To Conclude...
          </div>
          <div className="subtitle">
            Our exploration of Spotify streaming has given us some interesting insights.
            We’ve been able to interact with and manipulate the datasets provided, and
            see how the data shifts when songs we know well are disincluded from the set.
            The data have taught us about what really makes a popular song, as well as who
            these artists are and where in the world they are being listened to. While this
            was a cursory look at Spotify data, as we were only exploring top songs in 2018,
            the methods we’ve used to manipulate the data and find interesting relationships
            are applicable to more vast and intricate datasets. This has been but a brief
            exploration of the world of data, giving you agency in the process of data
            visualization. I hope you enjoyed the journey and are inspired to dig deeper
            into the data that runs our daily lives.
          </div>
        </div>
      </div>
    );
  }
}

RootComponent.displayName = 'RootComponent';
export default RootComponent;
