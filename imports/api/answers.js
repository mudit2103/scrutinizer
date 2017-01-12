import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { requireLogin } from './utils.js';
import { Questions } from './questions.js';
import { check } from 'meteor/check';
 
export const Answers = new Mongo.Collection('answers');

if (Meteor.isServer) {
  Meteor.publish('answers', function() {
    return Answers.find({});
  });
}

Meteor.methods({
  'answers.upsert'({question_id, applicant_id, text}) {
    requireLogin(this.userId);
    if (!Questions.findOne({_id: question_id})) {
      throw new Meteor.Error('Invalid question id');
    }
    check(applicant_id, String);
    check(text, String);

    const selector = {
      question_id: question_id,
      applicant_id: applicant_id
    };
    const modifier = {
      question_id: question_id,
      applicant_id: applicant_id,
      text: text
    };
    Answers.upsert(selector, modifier);
  }
});
