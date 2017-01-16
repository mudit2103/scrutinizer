import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Materialize } from 'meteor/materialize:materialize';
import { Approved } from '../../../api/utils.js';
import './loginForm.html';

Template.loginForm.onCreated(function() {
  Meteor.subscribe('approved');

  this.creating = new ReactiveVar(false);
});

Template.loginForm.helpers({
  creating() {
    return Template.instance().creating.get();
  },
});

Template.loginForm.events({
  'click #signup'(event, instance) {
    instance.creating.set(!instance.creating.get());
  },
  'submit .login-form'(event, instance) {
    event.preventDefault();
    const isCreating = instance.creating.get();
    const email = $('#email').val();
    const password = $('#password').val();

    if (email.length === 0 || password.length === 0) {
      Materialize.toast('Fields cannot be empty', 4000);
      return;
    }

    if (!isCreating) {
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          Materialize.toast(err.reason, 4000);
        }
      });
    } else {
      const name = $('#name').val();
      const passwordAgain = $('#password-again').val();

      if (name.length === 0 || passwordAgain.length === 0) {
        Materialize.toast('Fields cannot be empty', 4000);
        return;
      }
      if (password !== passwordAgain) {
        Materialize.toast('Password do not match', 4000);
        return;
      }

      const approved = Approved.findOne({email: email});
      if (!approved) {
        Materialize.toast('Email is not approved', 4000);
        return;
      }

      Accounts.createUser({
        username: name,
        email: email,
        password: password
      }, function(err) {
        if (err) {
          Materialize.toast(err.reason, 4000);
        }
      });
    }
  }
});

