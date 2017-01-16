import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { requireLogin } from './utils.js';

/** Role Schema
{
  _id: ‘61b jm’
  link: 'url to Google Sheet'
  limit: 20
}
*/
export const Roles = new Mongo.Collection('roles');

if (Meteor.isServer) {
  Meteor.publish('roles', function() {
    if (!this.userId) {
      return null;
    }
    return Roles.find({});
  });
}

Meteor.methods({
  'roles.new'({id, limit}) {
    requireLogin(this.userId);
    check(id, String);
    if (limit) {
      check(limit, Number);
    }

    Roles.insert({_id: id, limit: limit});
  }, 
  'roles.remove'(id) {
    requireLogin(this.userId);
    check(id, String);

    Roles.remove({_id: id});
  },
});