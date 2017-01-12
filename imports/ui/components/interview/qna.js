import { Template } from 'meteor/templating';
import { Answers } from '../../../api/answers.js';

import './qna.html';

Template.qna.onCreated(function() {
})

Template.qna.onRendered(function() {
  const context = Template.currentData();

  Meteor.subscribe('answers', function() {
    const answer = Answers.findOne({question_id: context._id, applicant_id: context.applicant_id});
    if (answer) {
      $('#answer-' + context._id).val(answer.text);
    }
  });
});

Template.qna.helpers({
});

Template.qna.events({
  'click .save-qna'(event, instance) {
    Meteor.call('answers.upsert', {
      question_id: this._id,
      applicant_id: this.applicant_id,
      text: instance.$('#answer-' + this._id).val()
    }, function(err) {
      if (err) {
        Materialize.toast(err.reason, 6000);
      } else {
        Materialize.toast('Saved answer!', 6000);
      }
    });
  },
});