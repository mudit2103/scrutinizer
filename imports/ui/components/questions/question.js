import { Materialize } from 'meteor/materialize:materialize';
import { Session } from 'meteor/session';
import './question.html';

Template.question.onCreated(function() {
  const context = Template.currentData()

  this.editing = new ReactiveVar(false);
  Session.set('lastQuestionCategory', context.category);
});

Template.question.helpers({
  editing() {
    return Template.instance().editing.get();
  },
});

Template.question.events({
  'click .edit-region'(event, instance) {
    instance.editing.set(true);
  },
  'mouseenter .edit-question'() {
    Materialize.updateTextFields();
  },
  'keyup input': function(event, instance) {
    if (event.which === 13) {
      event.stopPropagation();
      const category = $('input#category').val();
      const text = $('input#text').val();
      var priority = parseInt($('input#priority').val());

      if (priority === NaN) {
        priority = 0;
      }
      Meteor.call('questions.update', {id: this._id, category: category, priority: priority, text: text}, function(err) {
        if (err) {
          toast(err.reason);
        } else {
          toast('Question updated successfully');
        }
      });
      instance.editing.set(false);
    }
  },
  'click .exit'(event, instance) {
    instance.editing.set(false);
  },
  'click .delete'(event, instance) {
    Meteor.call('questions.remove', this._id, function(err) {
      if (err) {
        toast(err.reason);
      }
    });
  }
});

function toast(s) {
  Materialize.toast(s, 6000);
}
