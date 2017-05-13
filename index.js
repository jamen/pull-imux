
var { pull, drain } = require('pull-stream')
var splitter = require('pull-splitter')
var pushable = require('pull-pushable')

module.exports = imux

function imux (streams) {
  var [sink, sources, rest] = splitter(streams)
  var { push, end, source: main } = pushable(true)
  var channels = {}
  var count = 0

  for (var name in sources) {
    count++
    channels[name] = {
      source: sources[name],
      sink: drain(push, err => {
        count++
        if (err || count) return end(err)
      })
    }
  }

  function transform (read) { 
    // Pass read to splitter sink
    sink(read)
    // Return the merged responses
    return main
  }

  return [transform, channels, rest]
}

