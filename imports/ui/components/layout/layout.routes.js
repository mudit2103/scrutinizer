import { Router } from 'meteor/iron:router';

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.render('applicants')
});

Router.route('/applicants', function() {
  this.render('applicants');
});

Router.route('/interview', function() {
  this.render('interview');
});

Router.route('/questions', function() {
  this.render('questions');
});
