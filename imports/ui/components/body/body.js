import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
 
import './body.html';
import './body.css';
import '../applicants/applicants.js';
import '../interview/interview.js';
import '../questions/questions.js';

Template.body.onCreated(function bodyOnCreated() {
  this.activeTemplate = new ReactiveVar('applicants');
});
 
Template.body.helpers({
  applicantsActive() {
    return Template.instance().activeTemplate.get() === 'applicants';
  },
  questionsActive() {
    return Template.instance().activeTemplate.get() === 'questions';
  },
  interviewActive() {
    return Template.instance().activeTemplate.get() === 'interview';
  },
});

Template.body.events({
  'click #showApplicants'(event, template) {
    template.activeTemplate.set('applicants');
  },
  'click #showQuestions'(event, template) {
    template.activeTemplate.set('questions');
  },
  'click #showInterview'(event, template) {
    template.activeTemplate.set('interview');
  },
  'click #signout'(event) {
    Meteor.logout();
  },
});
