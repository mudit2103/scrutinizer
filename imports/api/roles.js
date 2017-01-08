import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { requireLogin } from './utils.js';

/** Role Schema
{
  _id: ‘61b jm’
  link: 'url to Google Sheet'
  spots: 20
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
