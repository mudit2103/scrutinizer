import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { requireLogin } from './utils.js';
import { check } from 'meteor/check';
import { Roles } from './roles.js';
 
export const Interviewing = new Mongo.Collection('interviewing');

if (Meteor.isServer) {
  Meteor.publish('interviewing.mine', function() {
    if (!this.userId) {
      return null;
    } else {
      const user = Meteor.users.findOne(this.userId);
      return Interviewing.find({user_email: user.emails[0].address})
    }
  });
  Meteor.publish('interviewing.all', function() {
    if (!this.userId) {
      return null;
    }
    return Interviewing.find({});
  });
}


Meteor.methods({
  'interviewing.upsert'({applicant_id, role, score, notes}) {
    requireLogin(this.userId);
    check(applicant_id, String);
    check(role, String);
    if (!Roles.findOne({_id: role})) {
      throw new Meteor.Error('Invalid role');
    }
    check(score, Number);
    check(notes, String);

    const user_email = Meteor.user().emails[0].address;

    const selector = {
      user_email: user_email,
      applicant_id: applicant_id,
      role: role
    };
    const modifier = {
      $set: {
        user_email: user_email,
        applicant_id: applicant_id,
        role: role,
        score: score,
        notes: notes
      }
    };

    Interviewing.upsert(selector, modifier);
  }
});
