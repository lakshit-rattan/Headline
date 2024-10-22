
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { FlatList, Swipeable } from 'react-native-gesture-handler';
import { getStoredNews, storeNews, fetchNews } from '../utils/newsUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewsFeedScreen = () => {
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
      const newNews = await fetchNews();
      await storeNews(newNews);
      setHeadlines(newNews);
      setDisplayedHeadlines(newNews.slice(0, 10));
      setPinnedHeadlines([]);
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
      setPinnedHeadlines((prevPinned) => [...prevPinned, headline]);
      setDisplayedHeadlines((prevHeadlines) =>
        prevHeadlines.filter((h) => h !== headline)
      );
    }
  };

  const renderRightActions = (headline) => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteHeadline(headline)}>
          <Image
            source={require('../assets/images/delete.png')}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.pinButton]}
          onPress={() => pinHeadline(headline)}>
          <Image
            source={require('../assets/images/pinIcon.png')}
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
      <View style={[styles.headlineItem, pinnedHeadlines.includes(item) && styles.pinnedItem]}>
        {pinnedHeadlines.includes(item) && (
          <View style={styles.pinnedIndicator}>
            <Image source={require('../assets/images/pin.png')} style={{ width: 13, height: 13 }}  resizeMode={'contain'}/>
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
            <Text numberOfLines={2} style={styles.headlineTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.authorName}>{item.author || 'Unknown Author'}</Text>
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
        <Image
          style={{width: 111, height: 31}}
          source={require('../assets/images/heading.png')}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={refreshNewsFeed}>
          <Image
            style={{width: 28, height: 28}}
            source={require('../assets/images/refresh.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={[...pinnedHeadlines, ...displayedHeadlines]}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        refreshing={isLoading}
        onRefresh={refreshNewsFeed}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#007AFF',
    padding: 15,
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  refreshButton: {
    padding: 10,
  },
  headlineItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  pinnedItem: {
    // backgroundColor: '#e6f3ff',
  },
  pinnedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  pinnedText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'Satoshi-Regular',
  },
  headlineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceImage: {
    width: 20,
    height: 20,
    // borderRadius: 10,
    marginRight: 6,
  },
  sourceName: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Satoshi-Regular',
  },
  publishTime: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Satoshi-Regular',
  },
  headlineBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headlineContent: {
    flex: 1,
    // backgroundColor: '#000',
    paddingRight:20,
    marginRight: 10,
  },
  headlineTitle: {
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
    fontFamily: 'Satoshi-Bold',
    // fontWeight: 'normal',
  },
  authorName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Satoshi-Medium',
  },
  newsImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  rightActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,

  },
  actionButton: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#4BBDFC',
    paddingTop:14,
    borderTopLeftRadius: 10,
    paddingBottom: 7,
  },
  pinButton: {
    paddingTop: 7,
    backgroundColor: '#4BBDFC',
    paddingBottom:14,
    borderBottomLeftRadius: 10,
  },
  actionIcon: {
    // fontSize: 24,
    width:22,
    height:22,
    // color: 'white',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Satoshi-Regular',
  },
  pinnedIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  refreshIcon: {
    fontSize: 24,
    color: 'white',
  },
  placeholderImage: {
    backgroundColor: '#e1e4e8',
  },
  separator: {
    height: 0.8,
    backgroundColor: '#ccc',
  },

  rowBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    // paddingRight: 10,
  },
  columnContainer: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    height: '100%',
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '50%',
  },
  backRightBtnTop: {
    backgroundColor: '#4BBDFC',
    borderTopLeftRadius: 20,
  },
  backRightBtnBottom: {
    backgroundColor: '#4BBDFC',
    borderBottomLeftRadius: 20,
    marginBottom: 20,
  },
  backTextWhite: {
    color: '#FFF',
    // marginTop: 5,
  },
});

export default NewsFeedScreen;
