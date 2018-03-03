import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default class RepositoryCell extends Component {
  render() {
    const { data } = this.props;
    return(
      <TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.title}>{data.full_name}</Text>
          <Text style={styles.description}>{data.description}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.author}>
              <Text>Author: </Text>
              <Image
                style={styles.image}
                source={{uri: data.owner.avatar_url}}
              />
            </View>
            <View style={styles.author}>
              <Text>Starts: </Text>
              <Text>{data.stargazers_count}</Text>
            </View>
            <Image
              style={styles.image}
              source={require('../../res/images/ic_star.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderWidth: 0.5,
    marginVertical: 3,
    borderRadius: 2,
    borderColor: '#dddddd',
    shadowColor: 'gray',
    shadowOffset: {width: 0.0, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2
  },
  image: {
    width: 22,
    height: 22
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginBottom: 3,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 3,
    color: '#757575'
  }
});