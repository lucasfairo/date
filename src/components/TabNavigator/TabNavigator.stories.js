import React, { PureComponent } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { createAppContainer, Header as HeaderRN } from 'react-navigation';
import { range } from 'lodash';

import { getContainerDecorator } from 'storybook';
import createTabNavigator from '.';
import ScrollView from './ScrollView';
import FlatList from './FlatList';

const stories = storiesOf('Components/TabNavigator', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

const styles = StyleSheet.create({
  item: {
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },

  header: {
    backgroundColor: '#FFEEFF',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Header = ({ animatedValue }) => {
  const animatedStyle = {
    opacity: animatedValue,
  };

  return (
    <Animated.View style={[styles.header, animatedStyle]}>
      <Text>Header</Text>
    </Animated.View>
  );
};

const createScrollViewTab = (backgroundColor, count = 100) => class Tab extends PureComponent {
  
  render() {
    return (
      <ScrollView>
        {range(count).map(item => (
          <View key={item} style={[styles.item, { backgroundColor }]}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }
};

const createFlatListTab = (backgroundColor, count = 100) => class Tab extends PureComponent {
  renderItem = ({ item }) => (
    <View key={item.key} style={[styles.item, { backgroundColor }]}>
      <Text>{item.key}</Text>
    </View>
  );

  render() {
    const data = range(count).map(i => ({ key: i.toString() }));

    return (
      <FlatList data={data} renderItem={this.renderItem} />
    );
  }
};

// Stories
stories.add('Default', () => {
  const TabNavigator = createTabNavigator({
    ScrollView: createScrollViewTab('#FEFEFE', 100),
    FlatList: createFlatListTab('#EEEEFF', 100),
    ShortScroll: createScrollViewTab('#FFEEFF', 2),
  }, {
    headerShrinkHeight: HeaderRN.HEIGHT,
    renderHeader: props => <Header {...props} />
  });

  const Story = createAppContainer(TabNavigator);

  return <Story />;
});
