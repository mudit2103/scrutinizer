import { Questions } from '../../../api/questions.js';
import { Answers } from '../../../api/answers.js';
import './reviewRow.html';

Template.reviewRow.onCreated(function() {
  Meteor.subscribe('questions');
  Meteor.subscribe('answers');
  const context = Template.currentData();

  this.showMore = new ReactiveVar(false);
  this.currStatus = new ReactiveVar(context.status);
});

Template.reviewRow.helpers({
  firstName() {
    return this.name.split(' ')[0];
  },
  statusClass() {
    const status = Template.instance().currStatus.get();
    if (status === 'accepted' || status === 'rejected') {
      return status;
    } else {
      return '';
    }
  },
  formattedScores() {
    var ret = '';
    _.each(this.scores, function(score) {
      ret += score + ', ';
    });
    return ret.substring(0, ret.length - 2);
  },
  showMore() {
    return Template.instance().showMore.get();
  },
  notecards() {
    const cards = [];
    for(var i = 0; i < this.interviewers.length; i++) {
      cards.push({interviewer: this.interviewers[i], interviewer_notes: this.notes[i], interviewer_score: this.scores[i]});
    }
    return cards;
  },
  answers() {
    return Answers.find({applicant_id: this._id}).map(function(answer) {
      const question = Questions.findOne({_id: answer.question_id});
      if (question) {
        answer.question = question.text;
      }
      return answer;
    });
  },
});

Template.reviewRow.events({
  'click .table-row'(event, instance) {
    instance.showMore.set(!instance.showMore.get());
  },
  'click .skip'(event, instance) {
    instance.showMore.set(false);
    $('html, body').animate({
      scrollTop: $(event.target).offset().top
    }, 400);
  },
  'click .accept'(event, instance) {
    Meteor.call('applicants.setStatus', {
      id: this._id,
      role: this.role,
      status: 'accepted'
    }, function(err) {
      if (err) {
        Materialize.toast(err.reason, 6000);
      } else {
        Materialize.toast('Saved acceptance', 6000);
      }
    });
    instance.currStatus.set('accepted');
    instance.showMore.set(false);
  },
  'click .reject'(event, instance) {
    Meteor.call('applicants.setStatus', {
      id: this._id,
      role: this.role,
      status: 'rejected'
    }, function(err) {
      if (err) {
        Materialize.toast(err.reason, 6000);
      } else {
        Materialize.toast('Saved rejection', 6000);
      }
    });
    instance.currStatus.set('rejected');
    instance.showMore.set(false);
  },
});

