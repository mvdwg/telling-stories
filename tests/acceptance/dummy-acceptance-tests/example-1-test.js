import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import _ from 'ember-cli-page-object';

moduleForAcceptance('Acceptance | Interacting with form elements');

const page = _.create({
  visit: _.visitable('/playground')
});

test('interacting like crazy with lots of form elements', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(currentURL(), '/stories');
  });

  page
    .clickOn('Click me!')
    .clickOn('Click me too!')
    .fillIn('example1', 'hello world')
    .clickOn('Checkbox');

  andThen(function() {
    assert.ok(page.contains('Lorem ipsum dolor'));
  });

  /* global stop */
  return stop();
});
