import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://asia-south1-kc-stage-rp.cloudfunctions.net/globalNews';

const axiosInstance = axios.create({
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
});

export const fetchNews = async () => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const response = await axiosInstance.post(API_URL, {}, {
      params: {
        endpoint: 'everything',
        q: 'tesla',
        to: today,
        from: '2024-10-13',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: '5c659f698d0549b0895d0fcb6ba84e20',
      }
    });
    return response.data.articles.slice(0, 100);
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    return [];
  }
};

export const storeNews = async (news) => {
  try {
    await AsyncStorage.setItem('storedNews', JSON.stringify(news));
  } catch (error) {
    console.error('Error storing news:', error);
  }
};

export const getStoredNews = async () => {
  try {
    const storedNews = await AsyncStorage.getItem('storedNews');
    return storedNews ? JSON.parse(storedNews) : [];
  } catch (error) {
    console.error('Error getting stored news:', error);
    return [];
  }
};
