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
            onPanResponderRelease: () => {
                this.resetPosition();
            },
        });

        this.state = { panResponder, position };
    }


    getCardStyle = () => {
        const { position } = this.state;
        const SCREEN_WIDTH = RN.Dimensions.get('window').width;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    resetPosition = () => {
        const { position } = this.state;

        Animated.spring(position, {
            toValue: { x: 0, y: 0 }
        }).start();
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
