
# pull-imux

> Transform stream composed of smaller duplex streams

An inverse MUX stream.  Returns a transform that is composed of channels (duplex streams)

```js
var [minify, channels] = imux({
  js: file => extname(file.path) === '.js',
  css: file => extname(file.path) === '.css'
})

// Program channels to transform the data:
pull(channels.js, minify_js(), channels.js)
pull(channels.css, minify_css(), channels.css)

// Use the transformations:
pull(
  read('src/**/*'),
  minify,
  write('out/')
)
```

[`pull-pair`] is to `pull-pair/duplex` as [`pull-splitter`] is to `pull-imux`

## Install

```sh
npm install --save pull-imux
```

```sh
yarn add pull-imux
```

## Usage

### `imux(config)`

Create a `transform` and `channels` stream, also `rest` where unknown data streams to (can be ignored)

`channels` corrosponds with each field from `config` to let you "route" your data into different duplexes:

```js
var [transform, channels, rest] = imux({
  high: n => n >= 50,
  low:  n => n < 50
})

// Setup the channels to transform the data
pull(
  channels.high,
  map(n => n * 2),
  channels.high
)

// For no transformations, do an "echo stream"
pull(channels.low, channels.low)

// Pull data through the transform
pull(
  values([ 20, 30, 40, 50, 60, 70 ]),
  transform,
  collect((err, values) => {
    t.same(values, [ 20, 30, 40, 100, 120, 140 ])
  })
)
```

## Also see

 - [`pull-mux`] combine and namespace multiple streams
 - [`pull-splitter`] split streams into other streams using filters
 - [`pull-pair`] for creating linked streams

---

Maintained by [Jamen Marz](https://git.io/jamen) (See on [Twitter](https://twitter.com/jamenmarz) and [GitHub](https://github.com/jamen) for questions & updates)

["inverse multiplexer" or "IMUX"]: https://en.wikipedia.org/wiki/Inverse_multiplexer
[`pull-stream`]: https://github.com/pull-stream/pull-stream
[`pull-pair`]: https://github.com/pull-stream/pull-pair
[`pull-splitter`]: https://github.com/jamen/pull-splitter
[`pull-mux`]: https://github.com/nichoth/pull-mux

