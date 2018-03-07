import React from 'react';
import RN, { Animated } from 'react-native';

const SCREEN_WIDTH = RN.Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default class Deck extends React.Component {

    static defaultProps = {
        onSwipeRight: () => { },
        onSwipeLeft: () => { },
    }

    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gestureState.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            },
        });

        this.state = { panResponder, position, index: 0 };
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const { position } = this.state;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }
    
    getCardStyle = () => {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-170deg', '0deg', '170deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
        }).start(() => this.onSwipeComplete(direction));
    }


    resetPosition = () => {
        const { position } = this.state;

        Animated.spring(position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    renderCards = () => {
        return this.props.data.map((item, itemIndex) => {
            if (itemIndex < this.state.index) { return null; }

            if (itemIndex === this.state.index) {
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
