import { Router } from 'meteor/iron:router';

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.render('review')
});

Router.route('/review', function() {
  this.render('review');
});

Router.route('/manage', function() {
  this.render('manage');
});

Router.route('/interview', function() {
  this.render('interview');
});

Router.route('/questions', function() {
  this.render('questions');
});
