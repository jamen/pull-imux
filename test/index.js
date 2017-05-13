
var test = require('tape')
var { pull, through, collect } = require('pull-stream')
var { read } = require('pull-files') 
var { extname, join } = require('path')
var minify_js = require('pull-minify-js')
var minify_css = require('pull-minify-css')
var imux = require('../')


test('imux stream', t => {
  t.plan(7)
  
  var [minify, channels, rest] = imux({
    js: file => extname(file.path) === '.js',
    css: file => extname(file.path) === '.css'
  })

  pull(
    channels.js,
    minify_js({ mangle: true, toplevel: true }),
    channels.js
  )

  pull(
    channels.css,
    minify_css(),
    channels.css
  )

  pull(
    read([ 'foo.js', 'foo.css', 'foo/**/*' ], { cwd: __dirname }),
    through(file => { file.before = file.data.length }),
    minify,
    through(file => { file.after = file.data.length }),
    collect((err, files) => {
      console.log(files)
      t.false(err, 'go no error')   
      t.is(files.length, 5, 'got 5 files') 
      for (var i = files.length; i--;) {
        var file = files[i]
        var path = file.base ? join(file.base, file.path) : file.path
        // console.log(file)
        t.true(file.before > file.after, 'got minified ' + path)
      }
    })
  )
})
