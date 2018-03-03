import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StatusBar,
  Platform,
  StyleSheet
} from 'react-native';

const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;

const StatusBarShape = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.oneOf(['default', 'light-content']),
  hidden: PropTypes.bool
};

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false
    }
  };
  static propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    titleView: PropTypes.element,
    hide: PropTypes.bool,
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
    statusBar: PropTypes.shape(StatusBarShape)
  };
  static defaultProps = {
    barStyle: 'light-content',
    hidden: false
  };
  render() {
    const {
      statusBar,
      title,
      titleView,
      leftButton,
      rightButton,
      style
    } = this.props;
    const status = (
      <View style={styles.statusBar}>
        <StatusBar {...statusBar} />
      </View>
    );
    const titleBar = titleView ? titleView : <Text style={styles.title}>{title}</Text>;
    const content = (
      <View style={styles.navBar}>
        {leftButton}
        <View style={styles.titleViewContainer}>
          {titleBar}
        </View>
        {rightButton}
      </View>
    )
    return(
      <View style={[styles.container, style]}>
        {status}
        {content}
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray'
  },
  navBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    flexDirection: 'row'
  },
  titleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
  }
});