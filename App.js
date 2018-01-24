import React from 'react';
import RN from 'react-native';
import Ball from './src/Ball'

export default class App extends React.Component {
  render() {
    return (
      <RN.View style={styles.container}>
        <Ball />
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
