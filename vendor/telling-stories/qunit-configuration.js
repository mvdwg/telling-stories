jQuery(function() {
  var qunit = window.QUnit;

  if (qunit) {
    qunit.config.urlConfig.push({
      id: 'tellingStories',
      label: 'Tell me the story'
    });

    if (qunit.urlParams.tellingStories) {
      qunit.urlParams.devmode = true;
      $('body').addClass('telling-stories');

      var callbacks = require('telling-stories');

      qunit.begin(callbacks.suiteStart);
      qunit.done(callbacks.suiteEnd);
      qunit.moduleStart(callbacks.moduleStart);
      qunit.moduleDone(callbacks.moduleEnd);
      qunit.testStart(callbacks.testStart);
      qunit.testDone(callbacks.testEnd);
    }
  }
});
