import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import Yup from 'yup';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldText_field on ProfileField {
    id
    label
    isRequired
    configs {
      ...on ProfileFieldTextConfigs {
        format
        secure
        regexp
        multiline
        minLength
        maxLength
      }
    }
  }
`;

const dataFragment = gql`
  fragment FieldText_data on ProfileFieldTextValue {
    stringValue: value
  }
`;

export default class FieldText extends PureComponent {
  static formOptions({ field, data }) {
    const { minLength, maxLength, regexp, format } = field.configs;
    let validationSchema = Yup.string();

    if (minLength) {
      validationSchema = validationSchema.min(minLength);
    }

    if (maxLength) {
      validationSchema = validationSchema.max(maxLength);
    }

    if (regexp) {
      validationSchema = validationSchema.matches(new RegExp(regexp), {
        excludeEmptyString: true,
      });
    }

    if (format === 'EMAIL') {
      validationSchema = validationSchema.email();
    }

    if (format === 'URL') {
      validationSchema = validationSchema.url();
    }

    return {
      validationSchema,
      initialValue: data && data.stringValue,
      transformResult: value => ({ stringValue: value }),
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    error: PropTypes.string,
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
        type="text"
        placeholder="Enter here..."
        label={field.label}
        {...field.configs}
      />
    );
  }
}