import React from 'react';
import RN, { Animated, LayoutAnimation, UIManager } from 'react-native';

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
                position.setValue({ x: gestureState.dx, y: gestureState.dy });
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental 
        && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const { position } = this.state;
        const item = data[this.state.index];

        position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });

        return direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
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
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }

        return this.props.data
            .map((item, itemIndex) => {
                if (itemIndex < this.state.index) { return null; }

                if (itemIndex === this.state.index) {
                    return (
                        <Animated.View
                            key={item.id}
                            {...this.state.panResponder.panHandlers}
                            style={[this.getCardStyle(), styles.cardStyle]}
                        >
                            {this.props.renderCard(item)}
                        </Animated.View>
                    );
                }

                return (
                    <Animated.View 
                        key={item.id} 
                        style={[styles.cardStyle, { top: 10 * (itemIndex - this.state.index) }]}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            })
            .reverse();
    }

    render() {
        return (
            <RN.View>
                {this.renderCards()}
            </RN.View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
    }
};
