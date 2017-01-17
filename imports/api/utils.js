import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Approved = new Mongo.Collection('approved');
export const Guidelines = new Mongo.Collection('guidelines');

if (Meteor.isServer) {
  Meteor.publish('approved', function() {
    return Approved.find({});
  });
  Meteor.publish('guidelines', function() {
    return Guidelines.find({});
  });
}

export const requireLogin = function(userId) {
  if (!userId) {
    throw new Meteor.Error('unauthorized');
  }
};
