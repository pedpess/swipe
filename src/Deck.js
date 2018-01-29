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

    getCardStyle = () => {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-500, 0, 500],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    renderCards = () => {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        {...this.state.panResponder.panHandlers}
                        style={this.getCardStyle()}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <RN.View>
                {this.renderCards()}
            </RN.View>
        );
    }
}
