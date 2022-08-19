import axios from 'axios';
import Notiflix from 'notiflix';

export default async function fetchPhotos(value, page) {
  try {
    console.log(value, page);
    const response = await axios({
      url: 'https://pixabay.com/api/',
      params: {
        key: '28373158-c538c9e9e2bb6e6b192e187c7',
        q: value,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}