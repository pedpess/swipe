import React from 'react';
import RN, { Animated } from 'react-native';

export default class Deck extends React.Component {

    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: () => { },
        });

        this.state = { panResponder, position };
    }

    renderCards = () => {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <Animated.View
                {...this.state.panResponder.panHandlers}
                style={this.state.position.getLayout()}
            >
                {this.renderCards()}
            </Animated.View>
        );
    }
}
