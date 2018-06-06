import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';
import Yup from 'yup'

const fieldFragment = gql`
  fragment FieldSwitch_field on ProfileField {
    id
    label
  }
`;

const dataFragment = gql`
  fragment FieldSwitch_data on ProfileFieldSwitchValue {
    booleanValue: value,
  }
`;

export default class FieldDate extends PureComponent {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.boolean(),
      initialValue: data && data.booleanValue,
      transformResult: value => ({ booleanValue: !!value }),
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  render() {
    const {
      field,
      ...props,
    } = this.props;

    return (
      <InputItem
        {...props}
        type="switch"
        label={field.label}
        {...field.configs}
      />
    );
  }
}