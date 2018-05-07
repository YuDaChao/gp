import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default class RepositoryCell extends Component {
  constructor(props) {
    super(props);
  }

  getFavoriteIcon = (isFavorite) => {
    return !isFavorite
      ? require('../../res/images/ic_unstar_transparent.png')
      : require('../../res/images/ic_star.png')
  }

  onClickFavorite = (id) => {
    this.props.handleFavoriteItem(id)
  }

  render() {
    const { data, onSelect, isFavorite } = this.props;
    return(
      <TouchableOpacity
        onPress={onSelect}
      >
        <View style={styles.container}>
          <View style={styles.top}>
            <View style={styles.author}>
              <Image
                style={styles.image}
                source={{uri: data.owner.avatar_url}}
              />
              <Text>{data.owner.login}</Text>
            </View>
            {/*<View>
              <Text style={styles.title}>{data.name}</Text>
            </View>*/}
          </View>
          <Text style={styles.description}>{data.description}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.author}>
              <Image
                style={styles.favorite}
                source={require('../../res/images/ic_favorite.png')}
              />
              <Text>{data.stargazers_count}</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.onClickFavorite(data.id)}
            >
              <Image
                style={[styles.image, {tintColor: '#2196F3'}]}
                source={this.getFavoriteIcon(isFavorite)}
              />
            </TouchableOpacity>
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
    marginRight: 8,
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
    color: '#90979c'
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 8,
    color: '#586069'
  }
});
