import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Applicants } from '../../../api/applicants.js';
import './review.html';
import './reviewRow.js';

Template.review.onCreated(function() {
  Meteor.subscribe('applicants');
});

Template.review.helpers({
  applicants() {
    return Applicants.find({});
  },
});
