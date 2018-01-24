import React from 'react';
import RN from 'react-native';

export default class Deck extends React.Component {

    renderCards = () => {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <RN.View>{this.renderCards()}</RN.View>
        );
    }
}
