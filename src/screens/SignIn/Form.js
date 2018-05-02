import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const ItemLogin = connectToStyleSheet('itemLogin', Item).withProps({ regular: true });
const ItemPassword = connectToStyleSheet('itemPassword', Item).withProps({ regular: true });
const InputTransparent = connectToStyleSheet('inputTransparent', Input).withProps({ placeholderTextColor: '#FFFFFF' });
const itemStyle = {
  paddingHorizontal: 10,
  borderRadius: 8,
  borderColor: 'rgba(255, 255, 255, .6)',
};
const ForgotPasswordButton = connectToStyleSheet('forgotPasswordButton', Button);
const ForgotPasswordText = connectToStyleSheet('forgotPasswordText', Text);
const ButtonSubmit = connectToStyleSheet('buttonSubmit', Button);

@styleSheet('Sparkle.SignInForm', {
  itemLogin: {
    ...itemStyle,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },

  itemPassword: {
    ...itemStyle,
    paddingRight: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  inputTransparent: {
    fontSize: 16,
    lineHeight: 17,
    color: '#FFFFFF',
  },

  forgotPasswordButton: {
    marginRight: -8,
    alignSelf: 'center',
  },

  forgotPasswordText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },

  buttonSubmit: {
    marginTop: 48,
  },
})
class SignInForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
    onForgotPasswordPress: propTypes.func.isRequired,
  };

  render() {
    const {
      onForgotPasswordPress,
      values,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isValid,
    } = this.props;

    return (
      <Form>
        <ItemLogin>
          <InputTransparent
            placeholder="Login"
            onChangeText={text => setFieldValue('login', text)}
            onBlur={() => setFieldTouched('login')}
            value={values.login}
          />
        </ItemLogin>

        <ItemPassword>
          <InputTransparent
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            value={values.password}
            secureTextEntry
          />

          <ForgotPasswordButton transparent small onPress={() => onForgotPasswordPress()}>
            <ForgotPasswordText>Forgot password?</ForgotPasswordText>
          </ForgotPasswordButton>
        </ItemPassword>

        <ButtonSubmit block onPress={handleSubmit}>
          <Text>Submit</Text>
        </ButtonSubmit>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required('Login is required'),
  password: yup.string().required('Password is required'),
});

export default withFormik({
  mapPropsToValues: props => ({ login: 'demo', password: 'demo1986' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(SignInForm);
