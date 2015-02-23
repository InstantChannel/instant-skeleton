
# destructure only what's needed
{div,small} = DOM

# Footer
module.exports = component common-mixins, ({props}) ->
  # render last visited page (sync'd across all sessions)
  div {class-name:\last-visited} [ small void "Last visited #{props.get-in [\session, \lastPage]}" ]
