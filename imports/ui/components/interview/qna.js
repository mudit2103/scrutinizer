import { Template } from 'meteor/templating';
import { Answers } from '../../../api/answers.js';

import './qna.html';

Template.qna.onCreated(function() {
  this.modified = new ReactiveVar(false);
});

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
  // This should allow user A to receive qna updates from user B hitting save
  answerTracker() {
    const answer = Answers.findOne({question_id: this._id, applicant_id: this.applicant_id});
    if (answer) {
      $('#answer-' + this._id).val(answer.text);
    }
  },
});

Template.qna.events({
  'input .materialize-textarea'(event, instance) {
    instance.modified.set(true);
  },
  'click .save-qna'(event, instance) {
    const answer = instance.$('#answer-' + this._id).val();
    if (answer.length === 0 || instance.modified.get() === false) {
      return;
    }
    Meteor.call('answers.upsert', {
      question_id: this._id,
      applicant_id: this.applicant_id,
      text: instance.$('#answer-' + this._id).val()
    }, function(err) {
      if (err) {
        Materialize.toast(err.reason, 4000);
      } else {
        Materialize.toast('Saved your answer!', 2000);
      }
    });
  },
});