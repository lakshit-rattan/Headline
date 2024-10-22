import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { fetchNews, storeNews } from './src/utils/newsUtils';
import { NewsFeedScreen, SplashScreen } from './src/screens';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Change the value of this fetchOption with accordance to the API you want to call
  const fetchOption = 'tesla' || 'apple';
  useEffect(() => {
      const fetchAndStoreNews = async () => {
      try {
        const news = await fetchNews(fetchOption);
        if (news.length > 0) {
          await storeNews(news, 'news');
        }

        if (news?.length === 0) {
          Alert.alert(
            'Network Error',
            'Unable to fetch news. Please check your internet connection and try again.',
            [{text: 'OK'}],
          );
        }
      } catch (error) {
        console.error('Error in fetchAndStoreNews:', error);
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndStoreNews();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="NewsFeed">
        {(props) => <NewsFeedScreen {...props} fetchOption={fetchOption} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
