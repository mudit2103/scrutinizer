import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
 
import './layout.html';
import './layout.scss';
import '../applicants/applicants.js';
import '../interview/interview.js';
import '../questions/questions.js';
import './layout.routes.js';

Template.layout.onCreated(function bodyOnCreated() {
  this.activeTemplate = new ReactiveVar('applicants');
});
 
Template.layout.events({
  'click #signout'(event) {
    Meteor.logout();
  },
});
