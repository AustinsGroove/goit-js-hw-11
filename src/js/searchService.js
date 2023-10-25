import { page, perPage } from './index';
import axios from 'axios';

export async function imageSearchService(serchParameter) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40203420-04db41a8a9312c45ba95b8564';
  const searchParams = {
    key: API_KEY,
    q: serchParameter,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  };
  try {
    const resp = await axios.get(BASE_URL, {
      params: searchParams,
    });
    return resp.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  }
}
