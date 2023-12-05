const baseURL = 'https://api-lita.ingello.com/v1';

export async function post(endpoint = '', data = {}) {
  const fullURL = `${baseURL}/${endpoint}`;

  const response = await fetch(fullURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

export async function put(endpoint = '', data = {}) {
  const fullURL = `${baseURL}/${endpoint}`;

  const response = await fetch(fullURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

export async function get(endpoint = '') {
  const fullURL = baseURL + '/' + endpoint;

  const response = await fetch(fullURL);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
