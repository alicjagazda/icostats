import fetch from 'isomorphic-fetch';

const baseUrl = 'https://api.cryptowat.ch';

export async function fetchTicker(a, b, exchange = 'coinbase', raw = false) {
  const url = `${baseUrl}/markets/${exchange}/${a}${b}/summary`;
  const res = await fetch(url);
  const json = await res.json();

  if (raw) {
    return json.result;
  }

  return json.result.price.last;
}

export async function fetchPairs(raw = false) {
  const url = `${baseUrl}/markets`;
  const res = await fetch(url);
  const json = await res.json();

  if (raw) {
    return json.result;
  }

  const priceMap = {};

  json.result.forEach((data) => {
    const { exchange, currencyPair } = data;

    if (!priceMap[currencyPair]) {
      priceMap[currencyPair] = fetchTicker.bind(currencyPair, '', exchange);
    }
  });

  return priceMap;
}

export async function fetchPrices() {
  const url = `${baseUrl}/markets`;
  const res = await fetch(url);
  const json = await res.json();

  const priceMap = {};

  json.result.forEach((data) => {
    const { exchange, currencyPair } = data;

    if (!priceMap[currencyPair]) {
      priceMap[currencyPair] = fetchTicker.bind(null, currencyPair, '', exchange);
    }
  });

  return priceMap;
}

export default {
  fetchPairs,
  fetchTicker,
  fetchPrices
};