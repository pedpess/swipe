import React from 'react';
import RN from 'react-native';
import Deck from './src/Deck';

export default class App extends React.Component {
  render() {
    return (
      <RN.View style={styles.container}>
        <Deck />
      </RN.View>
    );
  }
}

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
