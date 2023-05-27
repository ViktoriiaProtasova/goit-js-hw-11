import axios from 'axios';

export async function fetchImages(searchQuery, page, perPage) {
  const searchParams = new URLSearchParams({
    key: '14714406-4d485148789c4e4629afff759',
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const url = `https://pixabay.com/api/?${searchParams}&page=${page}&per_page=${perPage}`;
  const response = await axios.get(url);

  return response.data;
}
