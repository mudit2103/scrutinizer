import { Template } from 'meteor/templating';
import { Materialize } from 'meteor/materialize:materialize';
import Clipboard from 'clipboard';
import './emailsCopyable.html';

Template.emailsCopyable.onRendered(function() {
  const clipboard = new Clipboard('#copy-emails');

  clipboard.on('success', function(e) {
    e.clearSelection();
  });
});
