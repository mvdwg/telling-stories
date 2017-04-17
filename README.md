# telling-stories
[![Build Status](https://travis-ci.org/mvdwg/telling-stories.svg?branch=master)](https://travis-ci.org/mvdwg/telling-stories)

Acceptance tests are great, they run at machine speed and validate all
your features are working as expected, this is awesome, what if we wanted
to show a human how our features behave?

Telling stories is an addon that plays your acceptance tests,
simulating an actual human using your app, doubling the value of your acceptance tests!

These are main features:
* See a list of all features contained in your application
* Demo your features just by clicking play
* See how a user would interact with the elements of your app
* Just works™

![](http://g.recordit.co/bCo2jO4tCp.gif)

## How does it work?

`telling-stories` grabs all your acceptance tests and list them
so they can be show cased in a convenient way.

In order to reproduce the tests as a user would, `telling-stories`
relies on `ember-cli-page-object` to interact with the page. This means
only tests written using the mentioned addon will enjoy the benefits of
`telling-stories`

## Usage

```
$ ember install telling-stories
$ ember serve
```

Access http://localhost:4200/tests and you should see a new QUnit "Tell me the story" option on the top nav.
By enabling it, your tests will run in "human" mode.

## Examples

Code Corps [Video](https://www.youtube.com/watch?v=rzEEmkChYN8) | [Branch](https://github.com/mvdwg/code-corps-ember/tree/telling-stories)

## API

`telling-stories` exposes a tiny API for the end application to use.

### annotation

Show a custom message when playing the test.

__Signature__ `annotation(string): string`

__Example__

```js
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import page from '../pages/my-page';
import { annotation } from 'telling-stories';

moduleForAcceptance('Acceptance | foo bar');

test('a test', function(assert) {
  page.visit();

  annotation('Visiting /foo');

  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });

  annotation('Another message');
});
```

## Generate documentation site

To generate a visual documentation site for your app, just run

```
$ ember build:features
```

This command generates a documentation site on dist/ folder. You can check it
out locally by running

```
$ cd dist/
$ python -m SimpleHTTPServer
```


## Development

```
$ ember install telling-stories
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
