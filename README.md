# presence-sensor

this module is actually a simple wrapper for ping.
it uses ping modules to detect presence of people around a wifi box with their smartphone and deduce if the house is empty or not.

- init script with json input :
.init ({name : { ip : '192.168.1.95'})

- launch script : .launch

- read event
  * value changed (user , isalive?)
  * house entry
  * house leave
