const API_URL = process.env.API_URL;

export default function(url) {
  const status = (response) => {
    if (response.ok) {
      return response;
    }
    const error = new Error(response.statusText || response.status);
    error.response = response;
    throw error;
  };

  const json = (response) => response.json();

  return fetch(`${API_URL}${url}`)
    .then(status)
    .then(json)
    .catch((reason) => console.error(reason));
}
