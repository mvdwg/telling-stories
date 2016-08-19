import Ember from 'ember';

export function encode(params) {
  let param = params[0];

  return encodeURIComponent(param);
}

export default Ember.Helper.helper(encode);
