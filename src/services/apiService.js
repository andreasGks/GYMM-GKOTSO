const API_BASE_URL = 'https://countriesnow.space/api/v0.1';

export const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    const data = await response.json();
    return data.data.map((country) => ({
      name: country.country,
      code: country.iso2,
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const fetchCities = async (country) => {
  try {
    const response = await fetch(`${API_BASE_URL}/countries/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country }),
    });
    if (!response.ok) throw new Error('Failed to fetch cities');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};
