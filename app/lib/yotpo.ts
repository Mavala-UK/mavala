import type {YotpoReviewResponse} from './types';

export type yotpoData = {
  response: YotpoReviewResponse;
};

export async function getYotpoReviews(productId: string, appKey: string) {
  const url = `https://api-cdn.yotpo.com/v1/widget/${appKey}/products/${productId}/reviews.json`;
  const options = {
    method: 'GET',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = (await res.json()) as yotpoData;

    return data.response;
  } catch (error) {
    console.error('Error fetching Yotpo reviews', error);
    return undefined;
  }
}
