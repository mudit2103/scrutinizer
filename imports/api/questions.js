import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { requireLogin } from './utils.js';
import { check } from 'meteor/check';
import { Roles } from './roles.js';
 
export const Questions = new Mongo.Collection('questions');

if (Meteor.isServer) {
  Meteor.publish('questions', function() {
    if (!this.userId) {
      return null;
    }
    return Questions.find({});
  });
}

Meteor.methods({
  'questions.update'({id, text, category, priority}) {
    requireLogin(this.userId);
    check(text, String);
    check(category, String);
    check(priority, String);

    Questions.update(id, {$set: {text: text, category: category, priority: priority}});
  },
  'questions.new'({role, category}) {
    requireLogin(this.userId);
    check(role, String);
    if (role !== '' && !Roles.findOne({_id: role})) {
      throw new Meteor.Error('Invalid role');
    }

    Questions.insert({role: role, text: 'Empty Question', category: category, priority: 0});
  },
  'questions.remove'(id) {
    requireLogin(this.userId);

    Questions.remove(id);
  },
});
