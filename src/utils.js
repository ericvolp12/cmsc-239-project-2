// you can put util functions here if you want
// Gets an individual median from the data named by trait
function getMedian(data, trait) {
  data.sort((a, b) => a[trait] - b[trait]);
  return (
      data[(data.length - 1) >> 1][trait] +
      data[data.length >> 1][trait]
    ) / 2;
}

  // Gets the medians from all of our songs
export function getMedians(data, traits) {
  return traits.reduce((acc, key) => {
    acc[key] = getMedian(data, key);
    return acc;
  }, {});
}
