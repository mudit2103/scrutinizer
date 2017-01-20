import { Template } from 'meteor/templating';
import { Interviewing } from '../../../api/interviewing.js';
import { Applicants } from '../../../api/applicants.js';
import { Router } from 'meteor/iron:router';
import './history.html';

Template.history.onCreated(function() {
  Meteor.subscribe('interviewing.mine');
  Meteor.subscribe('applicants');
  Session.set('historyRole', '');
  Session.set('historyName', '');
});

Template.history.helpers({
  interviews() {
    return Interviewing.find({user_email: Meteor.user().emails[0].address})
      .map(function(interviewing) {
        const applicant = Applicants.findOne({_id: interviewing.applicant_id});

        if (applicant) {
          interviewing.name = applicant.name;
          return interviewing;
        }
      });
  },
});

Template.history.events({
  'click .interviews-row'(event) {
    event.preventDefault();
    const row = $(event.target);
    const name = row.attr('name');
    const role = row.attr('role');

    Session.set('historyName', name);
    Session.set('historyRole', role);
    Router.go('/interview');
  }
});
