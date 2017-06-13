import Expo, {AppLoading} from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {AnimationCloth} from './Scenes'
class App extends React.Component {
  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        // images: arrayFromObject(Images),
        // fonts: [
        //   {"retro": require('./assets/fonts/retro.ttf')},
        // ],
        // audio: arrayFromObject(AudioPhiles)
      });

      // await modelLoader.loadModels();

    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }
  state = {
    appIsReady: false
  }
  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          <AnimationCloth />
      </View>);
    }
    return <AppLoading />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Expo.registerRootComponent(App);
