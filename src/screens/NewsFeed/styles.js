import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginRight: 10,
  },
  headlineTitle: {
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
    fontFamily: 'Satoshi-Bold',
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#4BBDFC',
    paddingTop: 14,
    borderTopLeftRadius: 10,
    paddingBottom: 7,
  },
  pinButton: {
    paddingTop: 7,
    backgroundColor: '#4BBDFC',
    paddingBottom: 14,
    borderBottomLeftRadius: 10,
  },
  actionIcon: {
    width: 22,
    height: 22,
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
});

  export default styles;
