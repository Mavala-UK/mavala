import type {FeatureCollection} from 'geojson';
import {v4 as uuidv4} from 'uuid';
import {toTitleCase} from './utils';

const GOOGLE_SHEET_ID =
  '2PACX-1vQuP4gwsSJdjvzKWZcAFkjRPm7Ky19utf2BtgVJJxa7I-0-oLINKpZYn83usdi-I0S0femJcKR689x3';

export async function getStores() {
  const url = new URL('https://docs.google.com');
  url.pathname = `/spreadsheets/d/e/${GOOGLE_SHEET_ID}/pub`;
  url.searchParams.set('gid', '322517993');
  url.searchParams.set('single', 'true');
  url.searchParams.set('output', 'csv');

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Error retrieving Google Sheets data');
    }

    const data = await res.text();
    const rows = data.split('\n').slice(1);
    const geojson = {
      type: 'FeatureCollection',
      features: rows.map((row) => {
        const columns = (
          row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) ?? []
        )?.map((column) => column.replace(/"/g, ''));

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number(columns[9]), Number(columns[8])],
          },
          properties: {
            id: uuidv4(),
            name: toTitleCase(columns[1]),
            address1: toTitleCase(columns[2]),
            address2: toTitleCase(columns[3]),
            address3: toTitleCase(columns[4]),
            city: toTitleCase(columns[5]),
            zip: columns[6],
            country: toTitleCase(columns[7]),
            phone: columns[10],
            mail: columns[11],
            distance: 0,
          },
        };
      }),
    } satisfies GeoJSON.FeatureCollection;

    geojson.features = geojson.features.filter(
      (feature) =>
        feature.geometry.coordinates[0] !== 0 &&
        feature.geometry.coordinates[1] !== 0,
    );

    return geojson;
  } catch (error) {
    console.error(error);

    return {
      type: 'FeatureCollection',
      features: [],
    } satisfies FeatureCollection;
  }
}
