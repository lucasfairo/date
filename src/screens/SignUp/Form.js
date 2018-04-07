import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const disableShadowOnAndroid = {
  shadowColor: 'transparent',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0,
  elevation: 0,
};
const FormItem = connectToStyleSheet('formItem', Item).withProps({ regular: true });
const FormInput = connectToStyleSheet('formInput', Input).withProps({ placeholderTextColor: '#FFFFFF' });
const ButtonSubmit = connectToStyleSheet('buttonSubmit', Button).withProps({
  block: true,
  ...disableShadowOnAndroid,
});

@styleSheet('Sparkle.SignInForm', {
  formItem: {
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: 'rgba(255, 255, 255, .6)',
  },

  formInput: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  buttonSubmit: {
    marginTop: 40,
  },
})
class SignUpForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
  };

  render() {
    const {
      values,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isValid,
    } = this.props;

    return (
      <Form>
        <FormItem>
          <FormInput
            placeholder="Full Name"
            onChangeText={text => setFieldValue('name', text)}
            onBlur={() => setFieldTouched('name')}
            value={values.name}
          />
        </FormItem>
        <FormItem>
          <FormInput
            placeholder="Login"
            onChangeText={text => setFieldValue('login', text)}
            onBlur={() => setFieldTouched('login')}
            value={values.login}
          />
        </FormItem>
        <FormItem>
          <FormInput
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            value={values.password}
            secureTextEntry
          />
        </FormItem>
        <ButtonSubmit block onPress={handleSubmit}>
          <Text>Sign up</Text>
        </ButtonSubmit>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  login: yup.string().required('Login is required'),
  password: yup.string().required('Password is required'),
});

export default withFormik({
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(SignUpForm);
