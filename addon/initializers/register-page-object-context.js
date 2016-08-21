import { registerExecutionContext } from 'ember-cli-page-object/extend';
import ExecutionContext from '../page-object-execution-context';

export function initialize(/* application */) {
  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    registerExecutionContext('acceptance', ExecutionContext);
  }
}

export default {
  name: 'register-page-object-context',
  initialize
};
