import { Meteor } from 'meteor/meteor';

export const requireLogin = function(userId) {
  if (!userId) {
    throw new Meteor.Error('unauthorized');
  }
};
