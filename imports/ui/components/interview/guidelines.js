import { Template } from 'meteor/templating';
import { Guidelines } from '../../../api/utils.js';
import './guidelines.html';

Template.guidelines.onCreated(function() {
  Meteor.subscribe('guidelines');

  this.showing = new ReactiveVar(false);
});

Template.guidelines.helpers({
  showing() {
    return Template.instance().showing.get();
  },
  html() {
    const guidelines = Guidelines.findOne();
    if (guidelines) {
      return guidelines.text;
    } else {
      return '';
    }
  },
});

Template.guidelines.events({
  'click #hide.btn-guidelines'(event, instance) {
    $('.guidelines-card').animate({
      height: 61 
    });
    instance.showing.set(false);
  },
  'click #show.btn-guidelines'(event, instance) {
    $('.guidelines-card').animate({
      height: 841
    });
    instance.showing.set(true);
  }
});
