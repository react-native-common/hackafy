import axios from 'axios';
import { push } from 'react-router-redux';
import { API_URL } from '../../config/constants';
import {
  USER_SIGN_UP_START,
  USER_SIGN_UP_SUCCESS,
  USER_SIGN_UP_FAILURE,
  USER_SIGN_IN_START,
  USER_SIGN_IN_SUCCESS,
  USER_SIGN_IN_FAILURE,
  FACEBOOK_LOGIN_START,
  FACEBOOK_LOGIN_SUCCESS,
  USER_SIGN_OUT,
} from '../actionTypes';
import { handleNotificationReceived } from '../../actions'
import { createConsumerWithToken } from '../../actioncable/createConsumerWithToken';
import WebNotifications from '../../actioncable/WebNotificationsSubscription';

export const userSignUp = ({email, username, password}) => (dispatch) => {
  dispatch({type: USER_SIGN_UP_START});
  return axios.post(`${API_URL}/users/signup`, {
    email,
    username,
    password,
  })
  .then(({data}) => {
    dispatch({
      type: USER_SIGN_UP_SUCCESS,
      payload: data.user,
    });
    dispatch(push('/'));
    createConsumerWithToken(data.user.authenticationToken);
    console.log('Createing web notification subscription...')
    WebNotifications.subscribe((data) => {
      console.log('ACTION CABLE', data);
      const { notification } = JSON.parse(data.json);
      dispatch(handleNotificationReceived(notification))
    });
  }, ({response}) => {
    dispatch({
      type: USER_SIGN_UP_FAILURE,
      errors: response.data.errors,
    });
  });
}

export const userSignIn = (credentials) => (dispatch) => {
  dispatch({type: USER_SIGN_IN_START});
  return axios({
    method: 'post',
    url: `${API_URL}/users/signin`,
    data: {
      email: credentials.email,
      password: credentials.password,
    }
  })
  .then(({data}) => {
    console.log('successfully signed in', data);
    dispatch({
      type: USER_SIGN_IN_SUCCESS,
      payload: data.user,
    });
    dispatch(push('/'));
    createConsumerWithToken(data.user.authenticationToken);
    console.log('Createing web notification subscription...')
    WebNotifications.subscribe((data) => {
      console.log('ACTION CABLE', data);
      const { notification } = JSON.parse(data.json);
      dispatch(handleNotificationReceived(notification))
    });
  }, ({response}) => {
    dispatch({
      type: USER_SIGN_IN_FAILURE,
      errors: response.data.errors,
    });
  });
};

export const facebookLogin = ({id, username, email}) => (dispatch) => {
  dispatch({type: FACEBOOK_LOGIN_START});

  return axios({
    method: 'post',
    url: `${API_URL}/users/facebook/login`,
    data: {
      facebookId: id,
      username,
      email,
    }
  })
  .then(({data}) => {
    console.log('succcessfully signed in', data);
    dispatch({
      type: FACEBOOK_LOGIN_SUCCESS,
      payload: data.user,
    });
    dispatch(push('/'));
  })
};

export const userSignOut = () => (dispatch) => {
  console.log('ACTION CABLE removing subscription...')
  WebNotifications.unsubscribe();
  dispatch({type: USER_SIGN_OUT})
};
