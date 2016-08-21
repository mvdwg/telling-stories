import Ember from 'ember';
import { registerExecutionContext } from 'ember-cli-page-object/extend';
import ExecutionContext from '../page-object-execution-context';

const { RSVP, $ } = Ember;

if (window.QUnit && window.QUnit.urlParams.tellingStories) {
  Ember.Test.registerAsyncHelper('delay', function(app, milliseconds) {
    return new RSVP.Promise(function(resolve) {
      window.setTimeout(function() {
        resolve();
      }, milliseconds);
    });
  });
}

export function initialize(/* application */) {
  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    registerExecutionContext('acceptance', ExecutionContext);

    $('#qunit').css('display','none');
    $('#ember-testing').css('zoom', '1');
    $('#ember-testing-container').css({
      width: 'auto',
      height: '100%',
      borderStyle: 'none',
      margin: '0',
      overflow: 'visible'
    });
  }
}

export default {
  name: 'register-page-object-context',
  initialize
};
