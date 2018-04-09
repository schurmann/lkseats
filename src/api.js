// const API_URL = process.env.API_URL;
const API_URL = 'https://api-dev.lkticket.net';

export default function (url) {
  const status = (response) => {
    if (response.ok) {
      return response;
    }
    const error = new Error(response.statusText || response.status);
    error.response = response;
    throw error;
  };

  const json = response => response.json();

  const options = {
    cors: 'cors',
  };

  return fetch(`${API_URL}${url}`, options)
    .then(status)
    .then(json)
    .catch(reason => console.error(reason));
}
