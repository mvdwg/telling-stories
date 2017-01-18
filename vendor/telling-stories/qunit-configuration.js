jQuery(function() {
  if (window.QUnit) {
    window.QUnit.config.urlConfig.push({
      id: 'tellingStories',
      label: 'Tell me the story'
    });

    if (window.QUnit.urlParams.tellingStories) {
      window.QUnit.urlParams.devmode = true;
      $('body').addClass('telling-stories');
    }
  }
});
