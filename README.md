# telling-stories
[![Build Status](https://travis-ci.org/mvdwg/telling-stories.svg?branch=master)](https://travis-ci.org/mvdwg/telling-stories)

Review and document the features of your Ember application in an easy and fun way!

This Ember addon enhance your development cycle by giving your application the ability to tell all the features it contains in an easy way.

* See a list of all features contained in your application
* Demo your features just by clicking play
* If you're new to a project, just grab some popcorn dive in the list of
  features of the application by watching _recorded_ scenarios.

This addon retrieves the list of acceptance tests as features and allows you to run them in a player similar to a video player in a normal or fast speed. Review every feature's acceptance critiria while on it.

## Usage

### With ember-engines

```
$ ember install ember-engines@0.3.0
$ ember install telling-stories
```

Change the resolver of your application to use ember-engines ([link](https://github.com/dgeb/ember-engines/blob/8be97d771a64c289eed033feeea2c21566623277/README.md#customizing-the-resolver)).

Edit app/router.js to mount the new engine

```js
Router.map(function() {
  this.mount('telling-stories-dashboard');
  ...
});
```

Access http://localhost:4200/telling-stories-dashboard

### Without ember-engines

```
$ ember install telling-stories
```

Access http://localhost:4200/tests

You should see a new QUnit "Tell me the story" option on the top nav. By enabling this, your tests will run in player mode.

### Mirage

If you're using mirage you need to add a passthrough rule for `/telling-stories.json` route.

`mirage/config.js`

```js
export default function() {
  this.passthrough('/telling-stories.json');
  ...
});
```
__Note that we are registering the passthrough rule before any `this.namespace` call`__

## Development

### Installation

```
$ ember install telling-stories
```

### Running

```
$ ember serve
```

Building the app with logger enabled

```
$ DEBUG=telling-stories DEBUG_LEVEL=trace ember build
```

and then visit your app at http://localhost:4200.

### Tests

```
$ npm test
```

## License

telling-stories is licensed under the MIT license.

See [LICENSE](./LICENSE.md) for the full license text.
