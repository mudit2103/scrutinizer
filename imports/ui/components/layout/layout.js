import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
 
import './layout.html';
import './layout.scss';
import './loginForm.js';
import '../manage/manage.js';
import '../review/review.js';
import '../interview/interview.js';
import '../questions/questions.js';
import '../history/history.js';
import './layout.routes.js';

Template.layout.onCreated(function bodyOnCreated() {
  this.activeTemplate = new ReactiveVar('review');
  this.title = new ReactiveVar('CSM Scrutinizer');

  Session.set('role', '');
  Session.set('lastQuestionCategory', '');
});

Template.layout.helpers({
  name() {
    return Meteor.userId() && Meteor.user() && Meteor.user().username ? '(' + Meteor.user().username + ')' : '';
  },
  title() {
    return Template.instance().title.get();
  },
});
 
Template.layout.events({
  'click #signout'(event) {
    Meteor.logout();
  },
  'click #nav-mobile a'(event, instance) {
    if (event.target.getAttribute('id') === 'showInterview') {
      instance.title.set('Remember to hit save!');
    } else {
      instance.title.set('CSM Scrutinizer');
    }
  }
});
