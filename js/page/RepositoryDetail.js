import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  WebView,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtils from '../util/ViewUtils';


const URL = "https://github.com/";

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.url = this.props.item.html_url || `${URL}${this.props.item.fullName}`;
    this.title = this.props.item.full_name || this.props.item.fullName;
    this.state = {
      url: this.url,
      title: this.title,
      canGoBack: false
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
  }
  go = () => {
    this.setState({
      url: this.text
    })
  }
  render() {
    return(
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}

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
  }
});
