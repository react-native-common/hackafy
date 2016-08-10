import { combineReducers } from 'redux';
import {
  FETCH_PUBLIC_PROFILE_START,
  FETCH_PUBLIC_PROFILE_SUCCESS,
  FETCH_PUBLIC_PROFILE_FAILURE,
  FETCH_POSTS_BY_USERNAME_SUCCESS
} from '../actions/actionTypes'

const initialState = {
  allUsernames: [],
  byUsername: {
    postIds: [],
  },
  isFetching: false,
};

const allUsernames = (state = initialState.allUsernames, action) => {
  switch (action.type) {
    case FETCH_PUBLIC_PROFILE_SUCCESS:
      if (state.indexOf(action.payload.username) === -1) {
        return [...state, action.payload.username];
      } else {
        return state;
      }
    default:
      return state;
  }
}

const byUsername = (state = initialState.byUsername, action) => {
  switch (action.type) {
    case FETCH_PUBLIC_PROFILE_SUCCESS:
      return {
        ...state,
        [action.payload.username]: {
          ...state[action.payload.username],
          ...action.payload,
        }
      }
    case FETCH_POSTS_BY_USERNAME_SUCCESS:
      return {
        ...state,
        [action.username]: {
          ...state[action.username],
          postIds: action.payload.map(post => post.id),
        }
      }
    default:
      return state;
  }
}

const isFetching = (state = initialState.isFetching, action) => {
  switch (action.type) {
    case FETCH_PUBLIC_PROFILE_START:
      return true;
    case FETCH_PUBLIC_PROFILE_SUCCESS:
    case FETCH_PUBLIC_PROFILE_FAILURE:
      return false;
    default:
      return state;
  }
}

const publicProfiles = combineReducers({
  allUsernames,
  byUsername,
  isFetching,
});

export default publicProfiles;

/*** Selectors ***/
export const getPostIdsByUsername = (state, username) => {
  const user = state.byUsername[username];
  if (user) {
    return user.postIds || [];
  } else {
    return [];
  }
}

export const getPublicProfileByUsername = (state, username) => {
  const user = state.byUsername[username];
  return user || false;
}

export const getIsFetchingPublicProfile = (state) => state.isFetching;
