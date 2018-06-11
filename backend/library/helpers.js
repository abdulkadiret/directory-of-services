function fetchNestedObj(object) {
  return Object.keys(object)
    .reduce((accumulator, key) => {
      if (typeof object[key] !== 'object') {
        accumulator[key] = object[key];
        return accumulator;
      }
      return {
        ...accumulator,
        ...fetchNestedObj(object[key])
      }
    }, {});
}

// Part of calculation distance function
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Minimize  the distance number length
function round(value, place) {
  const multiplier = Math.pow(10, place || 0);
  return (Math.round(value * multiplier) / multiplier);
}

// Calculate the distance in Mile
function calculateDistance(lat1, lon1, lat2, lon2) {
  const radius = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const firtsValue = (Math.sin(dLat / 2) * Math.sin(dLat / 2));
  const secondValue = (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))) * (Math.sin(dLon / 2) * Math.sin(dLon / 2));
  const a = firtsValue + secondValue;
  const c = (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 0.621371;
  const distance = radius * c; // Distance in km
  return round(distance, 3);
}

// Get the distance and org data
function geoNear(lat, long, latLong) {
  const total = [];
  for (let i = 0; i < latLong.length; i += 1) {
    const { data } = latLong[i];
    if (latLong[i].lat && latLong[i].long) {
      total.push({ distance: calculateDistance(lat, long, latLong[i].lat, latLong[i].long), success: true, data })
    } else {
      total.push({
        distance: calculateDistance(lat, long, latLong[i].lat, latLong[i].long),
        success: true,
        message: 'dose not have postcode or postcode is incorrect',
        data
      })
    }
  }
  return total.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
}

export default {
  fetchNestedObj,
  geoNear
};
