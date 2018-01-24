import React from 'react';
import RN from 'react-native';

export default class Ball extends React.Component {
    componentWillMount() {
        this.position = new RN.Animated.ValueXY(0, 0);
        RN.Animated.spring(this.position, {
            toValue: { x: 200, y: 500 }
        }).start();
    }

    render() {
        return (
            <RN.Animated.View style={this.position.getLayout()}>
                <RN.View style={styles.ballStyle} />
            </RN.Animated.View>
        );
    }
}

const styles = RN.StyleSheet.create({
    ballStyle: {
        backgroundColor: '#000',
        borderRadius: 40,
        borderWidth: 10,
        width: 60,
        height: 60
    }
});
