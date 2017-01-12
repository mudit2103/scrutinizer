import { Template } from 'meteor/templating';
import { Questions } from '../../../api/questions.js';
import { Roles } from '../../../api/roles.js';
import { Materialize } from 'meteor/materialize:materialize';
import { Session } from 'meteor/session';
import './questions.html';
import './questions.css';
import './question.js';

Template.questions.onCreated(function() {
  Meteor.subscribe('roles');
  Meteor.subscribe('questions');

  this.choosingRole = new ReactiveVar(false);
  this.role = new ReactiveVar(Session.get('role'));
});

Template.questions.helpers({
  choosingRole() {
    return Template.instance().choosingRole.get();
  },
  role() {
    const currRole = Template.instance().role.get();
    if (currRole) {
      return currRole;
    }
    return 'All';
  },
  roles() {
    return Roles.find({});
  },
  questions() {
    return Questions.find({role: Template.instance().role.get()}, {sort: {category: -1, priority: -1}});
  },
});

Template.questions.events({
  'click .collection-item'(event, instance) {
    const role = $(event.target).text();

    if (role === 'All') {
      instance.role.set('');
    } else {
      instance.role.set(role);
    }
    instance.choosingRole.set(false);
  },
  'click .change-button'(event, instance) {
    instance.choosingRole.set(true);
  },
  'click .add-question'(event, instance) {
    Meteor.call('questions.new', {role: instance.role.get(), category: Session.get('lastQuestionCategory')}, function(err) {
      if (err) {
        Materialize.toast(err.reason, 6000);
      }
    });
  },
});
