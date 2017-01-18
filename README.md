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
