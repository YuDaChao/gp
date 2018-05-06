import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import HTMLView from 'react-native-htmlview'

export default class TrendingCell extends Component {
  render() {
    const { data, onSelect } = this.props;
    const desc = `<p>${data.description}</p>`
    return(
      <TouchableOpacity
        onPress={onSelect}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{data.fullName}</Text>
          <HTMLView
            value={desc}
          />
          <Text style={{color: '#586069', marginBottom: 14}}>{data.meta}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
             <View style={styles.author}>
               <Image
                 style={{tintColor: '#586069', height: 16, width: 16, marginRight: 5}}
                 source={require('../../res/images/ic_star.png')}
               />
                <Text style={{ marginRight: 10, color: '#586069'}}>{data.starCount}</Text>
              </View>
              <View style={styles.author}>
                <Text style={{ fontSize: 14, color: '#586069'}}>fork </Text>
                <Text style={{ marginRight: 10, color: '#586069'}}>{data.forkCount}</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#586069'}}>{data.contributors && data.contributors.length > 0 && 'Built by'} </Text>
              {data.contributors && data.contributors.map((c, i) => (
                <Image
                  key={i}
                  style={styles.image}
                  source={{uri: c}}
                />
              ))}
            </View>
            <Image
              style={styles.image}
              source={require('../../res/images/ic_unstar_navbar.png')}
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
    marginVertical: 5,
    borderRadius: 2,
    borderColor: '#dddddd',
    shadowColor: '#fafbfc',
    shadowOffset: {width: 0.0, height: 0.5},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2
  },
  image: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 8
  },
  favorite: {
    width: 18,
    height: 18,
    marginRight: 4
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 16,
    marginBottom: 3,
    color: '#0366d6'
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: '#586069'
  }
});
