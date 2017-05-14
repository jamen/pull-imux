
var { pull, drain } = require('pull-stream')
var splitter = require('pull-splitter')
var pushable = require('pull-pushable')

module.exports = imux

function imux (streams) {
  var input = splitter(streams)
  var sink = input[0]
  var sources = input[1]
  var rest = input[2]
  var p = pushable(true)
  var channels = {}
  var pending = 0

  for (var name in sources) {
    pending++
    channels[name] = {
      source: sources[name],
      sink: drain(p.push, function (err) {
        if (err || !--pending) p.end(err) 
      })
    }
  }

  function transform (read) { 
    // Pass read to splitter sink
    sink(read)
    // Return the merged responses
    return p.source
  }

  return [transform, channels, rest]
}

