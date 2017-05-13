
var { pull, drain } = require('pull-stream')
var splitter = require('pull-splitter')
var pushable = require('pull-pushable')

module.exports = imux

function imux (streams) {
  var [sink, sources, rest] = splitter(streams)
  var { push, end, source: main } = pushable(true)
  var channels = {}

  for (var name in sources) {
    channels[name] = {
      source: sources[name],
      sink: drain(push, end)
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

