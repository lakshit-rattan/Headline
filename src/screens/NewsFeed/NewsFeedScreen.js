import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { FlatList, Swipeable } from 'react-native-gesture-handler';
import { getStoredNews, storeNews, fetchNews } from '../../utils/newsUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

const NewsFeedScreen = ({fetchOption}) => {
  console.log(fetchOption);
  const [headlines, setHeadlines] = useState([]);
  const [displayedHeadlines, setDisplayedHeadlines] = useState([]);
  const [pinnedHeadlines, setPinnedHeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialHeadlines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedNews = await getStoredNews();
      if (storedNews.length === 0) {
        await refreshNewsFeed();
      } else {
        setHeadlines(storedNews);
        setDisplayedHeadlines(storedNews.slice(0, 10));
      }
    } catch (err) {
      setError('Failed to load news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialHeadlines();
  }, []);

  const addNewHeadlines = useCallback(() => {
    const newHeadlines = headlines.slice(displayedHeadlines.length, displayedHeadlines.length + 5);
    setDisplayedHeadlines(prevHeadlines => [...pinnedHeadlines, ...newHeadlines, ...prevHeadlines.filter(h => !pinnedHeadlines.includes(h))]);
  }, [headlines, displayedHeadlines, pinnedHeadlines]);

  const refreshNewsFeed = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newNews = await fetchNews(fetchOption);
      await storeNews(newNews);
      setHeadlines(newNews);
      setDisplayedHeadlines(newNews.slice(0, 10));
    } catch (err) {
      setError('Failed to refresh news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(addNewHeadlines, 10000);
    return () => clearInterval(timer);
  }, [addNewHeadlines]);

  const deleteHeadline = (headline) => {
    setDisplayedHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
    setPinnedHeadlines(prevPinned => prevPinned.filter(h => h !== headline));
    setHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
  };

  const pinHeadline = (headline) => {
    if (!pinnedHeadlines.includes(headline)) {
      setPinnedHeadlines(prevPinned => [headline, ...prevPinned]);
      setDisplayedHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
    }
  };

  const renderRightActions = (headline) => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteHeadline(headline)}>
          <Image
            source={require('../../assets/images/delete.png')}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.pinButton]}
          onPress={() => pinHeadline(headline)}>
          <Image
            source={require('../../assets/images/pinIcon.png')}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>Pin</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={[styles.headlineItem]}>
        {pinnedHeadlines.includes(item) && (
          <View style={styles.pinnedIndicator}>
            <Image source={require('../../assets/images/pin.png')} style={{ width: 13, height: 13 }}  resizeMode={'contain'}/>
            <Text style={styles.pinnedText}>Pinned to top</Text>
          </View>
        )}
        <View style={styles.headlineTop}>
          <View style={styles.sourceContainer}>
            {item.urlToImage ? (
              <Image source={{ uri: item.urlToImage }} style={styles.sourceImage} />
            ) : (
              <View style={[styles.sourceImage, styles.placeholderImage]} />
            )}
            <Text style={styles.sourceName}>{item.source?.name || 'Unknown Source'}</Text>
          </View>
          <Text style={styles.publishTime}>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <View style={styles.headlineBottom}>
          <View style={styles.headlineContent}>
            <Text style={styles.headlineTitle}>{item.title}</Text>
            <Text style={styles.authorName}>{item.author || 'Unknown Author'}</Text>
          </View>
          {item.urlToImage ? (
            <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
          ) : (
            <View style={[styles.newsImage, styles.placeholderImage]} />
          )}
        </View>
      </View>
    </Swipeable>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshNewsFeed}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
       <Image style={{ width: 111, height: 31 }} source={require('../../assets/images/heading.png')} resizeMode="contain" />
        <TouchableOpacity onPress={refreshNewsFeed}>
          <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/refresh.png')} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={[...pinnedHeadlines, ...displayedHeadlines.filter(h => !pinnedHeadlines.includes(h))]}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        refreshing={isLoading}
        onRefresh={refreshNewsFeed}
      />
    </SafeAreaView>
  );
};

export default NewsFeedScreen;
