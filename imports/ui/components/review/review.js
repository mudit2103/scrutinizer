import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '../../../api/questions.js';
import { Roles } from '../../../api/roles.js';
import { Applicants } from '../../../api/applicants.js';
import { Interviewing } from '../../../api/interviewing.js';
import './review.html';
import './review.css';
import './reviewRow.js';

Template.review.onCreated(function() {
  Meteor.subscribe('applicants');
  Meteor.subscribe('roles');
  Meteor.subscribe('questions');
  Meteor.subscribe('interviewing.all');

  this.choosingRole = new ReactiveVar(true);
  this.role = new ReactiveVar('');
});

Template.review.helpers({
  choosingRole() {
    return Template.instance().choosingRole.get();
  },
  role() {
    return Template.instance().role.get();
  },
  roles() {
    return Roles.find({});
  },
  applicants() {
    const instance = Template.instance();
    const all = Applicants.find({roles: instance.role.get()}).map(function(applicant) {
      applicant.role = instance.role.get();
      const idx = applicant.roles.indexOf(applicant.role);
      applicant.status = applicant.statuses[idx];

      const interviewings = Interviewing.find({applicant_id: applicant._id, role: instance.role.get()}).fetch();
      applicant.interviewers = [];
      applicant.scores = [];
      applicant.total = 0;
      applicant.notes = [];
      _.each(interviewings, function(i) {
        applicant.interviewers.push(i.user_id);
        applicant.scores.push(i.score);
        applicant.total += i.score;
        applicant.notes.push(i.notes);
      });
      return applicant;
    });

    return all.sort(function(a, b) {
      return b.total - a.total;
    });
  },
});

Template.review.events({
  'click .collection-item'(event, instance) {
    const role = $(event.target).text();

    instance.role.set(role);
    instance.choosingRole.set(false);
  },
  'click .change-button'(event, instance) {
    instance.choosingRole.set(true);
  },
});