import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { requireLogin } from './utils.js';
import { check } from 'meteor/check';
import { Roles } from './roles.js';

/** Applicant Schema
{
  _id: '<email address>''
  name: 'first last'
  year: 'senior'
  roles: ['61b jm', '61a sm', ... ]
  statuses: ['pending', 'accepted', ...]
}
*/
export const Applicants = new Mongo.Collection('applicants');
const STATUS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected'
}

if (Meteor.isServer) {
  Meteor.publish('applicants', function() {
    return Applicants.find({});
  });
}

Meteor.methods({
  'parseCSV'(data) {
    check(data, Array);
    const errorRows = [];
    const applicants = [];

    for (var i = 0; i < data.length; i++) {
      const row = data[i];

      if (!row[0]) {
        errorRows.push({row: i+1, reason: 'Name was blank'});
      } else if (row[1].indexOf('@') == -1) {
        errorRows.push({row: i+1, reason: 'Invalid email address'})
      } else {
        applicants.push({_id: row[1], name: row[0],  year: row[2]});
      }
    }
    return {errors: errorRows, applicants: applicants};
  },
  // Return num of rows updated and num rows first inserted
  'applicants.insertWithRole'({role, applicants}) {
    requireLogin(this.userId);
    check(role, String);
    if (!Roles.findOne({_id: role})) {
      throw new Meteor.Error('Invalid role');
    }

    var updates = 0;

    _.each(applicants, function(applicant) {
      const oldApplicant = Applicants.findOne({_id: applicant._id});

      if (oldApplicant) {
        if (oldApplicant.roles && !oldApplicant.roles.includes(role)) {
          Applicants.update({_id: oldApplicant._id}, {$push: {roles: role, statuses: 'pending'}});
        } else {
          Applicants.update({_id: oldApplicant._id}, {$set: {roles: [role], statuses: ['pending']}});
        }
        updates++;
      } else {
        applicant.roles = [role];
        applicant.statuses = ['pending'];
        Applicants.insert(applicant);
      }
    });

    return updates;
  },
  'applicants.setStatus'({id, role, status}) {
    requireLogin(this.userId);

    check(role, String);
    if (!Roles.findOne({_id: role})) {
      throw new Meteor.Error('Invalid role');
    }
    check(id, String);
    check(status, String);

    const applicant = Applicants.findOne({_id: id});
    if (applicant) {
      const idx = applicant.roles.indexOf(role);
      if (idx === -1) {
        throw new Meteor.Error('Invalid role');
      }
      applicant.statuses[idx] = status;
      Applicants.update({_id: id}, {$set: {statuses: applicant.statuses}});
    } else {
      throw new Meteor.Error('Applicant not found with given id');
    }
  }
});
