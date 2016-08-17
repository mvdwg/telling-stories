import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | stories');

test('visiting /stories', function(assert) {
  visit('/stories');

  andThen(function() {
    assert.equal(currentURL(), '/stories');
  });
});
