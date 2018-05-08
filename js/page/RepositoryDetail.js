import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  WebView,
  TouchableOpacity,
  Image
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtils from '../util/ViewUtils';
import FavoriteDao from "../expand/dao/FavoriteDao";


const URL = "https://github.com/";

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.url = this.props.item.data.html_url || `${URL}${this.props.item.data.fullName}`;
    this.title = this.props.item.data.full_name || this.props.item.data.fullName;
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      url: this.url,
      title: this.title,
      canGoBack: false,
      isFavorite: this.props.item.isFavorite
    }
  }

  onNavigationStateChange(e) {
    this.setState({
      url: e.url,
      canGoBack: e.canGoBack
    });
  }

  onBack = () => {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      this.props.navigator.pop();
    }
  };

  getFavoriteIcon = (isFavorite) => {
    return isFavorite
      ? <Image style={styles.image} source={require('../../res/images/ic_star.png')} />
      : <Image style={styles.image} source={require('../../res/images/ic_star_navbar.png')} />
  };

  onRightButtonClick = () => {
    const { data, isFavorite } = this.props.item;
    const id = data.id || data.fullName;
    this.setState({
      isFavorite: !isFavorite
    });
    this.favoriteDao.updateFavoriteKeys(id, data)
  };

  renderRightButton = () => {
    const { isFavorite } = this.state;
    return (
      <TouchableOpacity
        onPress={this.onRightButtonClick}
      >
        {this.getFavoriteIcon(isFavorite)}
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}
          rightButton={this.renderRightButton()}
        />
        <WebView
          ref={webView => this.webView = webView}
          source={{uri: this.state.url}}
          startInLoadingState={true}
          onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    margin: 10
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10
  }
});
