import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Approved = new Mongo.Collection('approved');

if (Meteor.isServer) {
  Meteor.publish('approved', function() {
    return Approved.find({});
  });
}

export const requireLogin = function(userId) {
  if (!userId) {
    throw new Meteor.Error('unauthorized');
  }
};
