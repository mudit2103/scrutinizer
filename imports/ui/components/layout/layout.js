import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
 
import './layout.html';
import './layout.scss';
import '../manage/manage.js';
import '../review/review.js';
import '../interview/interview.js';
import '../questions/questions.js';
import './layout.routes.js';

Template.layout.onCreated(function bodyOnCreated() {
  this.activeTemplate = new ReactiveVar('review');
  Session.set('role', '');
  Session.set('lastQuestionCategory', '');
});
 
Template.layout.events({
  'click #signout'(event) {
    Meteor.logout();
  },
});
