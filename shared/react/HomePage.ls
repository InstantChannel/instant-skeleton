
require! {
  immstruct
  omniscient: component
  react: {DOM:{div,h1,h2,input,code}}:React
}

HomePage = component ({cursor}:props) ->
  value     = cursor.get \greeting
  on-change = -> cursor.update \greeting (-> \YO)
  div class-name: \HomePage,
    h1 void (cursor.get \greeting)
    h2 void 'All Props:'
    code void (JSON.stringify props)
    input {value, on-change}


module.exports = (locals) ->
  state  = immstruct {greeting: 'Hello World!'} <<< locals.async-state
  render = -> HomePage state.cursor!
  state.on \next-animation-frame render
  render!
