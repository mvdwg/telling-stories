import overrideHelpers from '../override-helpers';

export function initialize(/* application */) {
  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    overrideHelpers();
  }
}

export default {
  name: 'register-override-test-helpers-initializers',
  initialize
};
