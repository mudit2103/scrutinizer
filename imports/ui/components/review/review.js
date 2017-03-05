import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '../../../api/questions.js';
import { Roles } from '../../../api/roles.js';
import { Applicants } from '../../../api/applicants.js';
import { Interviewing } from '../../../api/interviewing.js';
import { Materialize } from 'meteor/materialize:materialize';
import './review.html';
import './review.css';
import './reviewRow.js';
import './emailsCopyable.js';

Template.review.onCreated(function() {
  Meteor.subscribe('applicants');
  Meteor.subscribe('roles');
  Meteor.subscribe('questions');
  Meteor.subscribe('interviewing.all');

  this.choosingRole = new ReactiveVar(true);
  this.role = new ReactiveVar('');
  this.showAccepted = new ReactiveVar(true);
  this.showRejected = new ReactiveVar(true);
  this.showEmails = new ReactiveVar(false);
  this.emails = new ReactiveVar([]);
});

Template.review.onRendered(function() {
  $('.loading').hide();
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
  showEmails() {
    return Template.instance().showEmails.get();
  },
  emails() {
    return Template.instance().emails.get().join(', ');
  },
  applicants() {
    const instance = Template.instance();
    const hideAccepted = !instance.showAccepted.get();
    const hideRejected = !instance.showRejected.get();

    const all = Applicants.find({roles: instance.role.get()}).map(function(applicant) {
      applicant.role = instance.role.get();
      const idx = applicant.roles.indexOf(applicant.role);
      applicant.status = applicant.statuses[idx];
      if (hideAccepted && applicant.status === 'accepted' || hideRejected && applicant.status === 'rejected') {
        return;
      }

      const interviewings = Interviewing.find({applicant_id: applicant._id, role: instance.role.get()}).fetch();
      applicant.interviewers = [];
      applicant.scores = [];
      applicant.weight = 0;
      applicant.notes = [];
      applicant.interviewer_name = [];
      _.each(interviewings, function(i) {
        const usernameToPush = Meteor.users.findOne({ "emails": { $elemMatch: { "address": i.user_email, "verified":false } } }).username

        applicant.interviewer_name.push(usernameToPush);



        applicant.interviewers.push(i.user_email);
        applicant.scores.push(i.score);
        applicant.weight += i.score;
        applicant.notes.push(i.notes);
      });
      if (interviewings.length > 0) {
        applicant.weight /= interviewings.length;
      }
      return applicant;
    });

    return all.sort(function(a, b) {
      if (a.weight === b.weight) {
        return a.name.localeCompare(b.name);
      }
      return b.weight - a.weight;
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
  'click #show-accepted'(event, instance) {
    instance.showAccepted.set(!instance.showAccepted.get());
  },
  'click #show-rejected'(event, instance) {
    instance.showRejected.set(!instance.showRejected.get());
  },
  'click .collect-accepted'(event, instance) {
    const emails = [];
    const role = instance.role.get();
    var count = 0;

    Applicants.find({roles: role}).forEach(function(applicant) {
      const idx = applicant.roles.indexOf(role);
      if (applicant.statuses[idx] === 'accepted') {
        emails.push(applicant._id);
        count++;
      }
    });
    instance.emails.set(emails);
    instance.showEmails.set(true);
    Materialize.toast('Collecting ' + count + ' acceptances', 4000);
  },
  'click .collect-non'(event, instance) {
    const emails = [];
    const role = instance.role.get();
    var count = 0;

    Applicants.find({roles: role}).forEach(function(applicant) {
      const idx = applicant.roles.indexOf(role);
      if (applicant.statuses[idx] !== 'accepted') {
        emails.push(applicant._id);
        count++;
      }
    });
    instance.emails.set(emails);
    instance.showEmails.set(true);
    Materialize.toast('Collecting ' + count + ' rejections', 4000);
  },
  'click .exit-emails'(event, instance) {
    instance.showEmails.set(false);
  },
});

