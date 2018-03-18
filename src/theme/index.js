import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleProvider } from 'native-base';
import getTheme from './components';
import themeVariables from './variables';

export * from './styleSheet';

export default class ThemeProvider extends Component {
  static propTypes = {
    variables: PropTypes.object,
  };

  static defaultProps = {
    variables: {},
  }

  render() {
    const variables = {
      ...themeVariables,
      ...this.props.variables,
    }

    return (
      <StyleProvider style={getTheme(variables)}>
        {this.props.children}
      </StyleProvider>
    )
  }
}
