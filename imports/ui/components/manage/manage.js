import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Applicants } from '../../../api/applicants.js';
import { Roles } from '../../../api/roles.js';
import { Materialize } from 'meteor/materialize:materialize';
import './manage.html';
import './manage.css';

Template.manage.onCreated(function() {
  this.uploading = new ReactiveVar(false);
  this.uploadErrors = new ReactiveVar([]);
});

Template.manage.onRendered(function() {
  // Getting the correct selected option only works if options are rendered this way
  Meteor.subscribe('roles', function() {
    const roles = Roles.find({}).fetch();

    _.each(roles, function(role) {
      $('.role-select').append($('<option></option').attr('value', role._id).text(role._id));
    });
    $('.role-select').material_select();
  });
});

Template.manage.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  showUploadErrors() {
    return Template.instance().uploadErrors.get().length > 0;
  },
  uploadErrors() {
    return Template.instance().uploadErrors.get();
  },
  roles() {
    return Roles.find({})
  },
});

Template.manage.events({
  'click .delete-role'(event, instance) {
    var role = $(event.target).parent().text();
    role = role.replace(/\(.*\)/, '');
    role = role.substring(0, role.length - 1);

    Meteor.call('roles.remove', role, function(err) {
      if (err) {
        toast(err.reason);
      } 
    });
  },
  'submit .role-submit'(event, instance) {
    event.preventDefault();
    const role = $('#role-input').val();
    var limit = parseInt($('#limit-input').val());
    if (limit === NaN) {
      limit = undefined;
    }

    Meteor.call('roles.new', {id: role, limit: limit}, function(err) {
      if (err) {
        toast(err.reason);
      }
    });
    $('#role-input').val('');
    $('#limit-input').val('')
  },
  'change .input-csv'(event, instance) {
    event.preventDefault();

    var selectElement = $('.role-select option:selected');
    var role = selectElement.text();

    if (!role) {
      toast('Please select a role');
      return;
    } 
    instance.uploading.set(true);
    selectElement.prop('disabled', true);

    Papa.parse(event.target.files[0], {
      complete(results, file) {
        Meteor.call('parseCSV', results.data, function(err, res) {
          if (err) {
            toast(err.reason);
            instance.uploading.set(false);
            selectElement.prop('disabled', false);
          } else {
            if (res.errors.length > 0) {
              toast('Some CSV rows had errors, see below');
              instance.uploadErrors.set(res.errors);
            } 
            const count = res.applicants.length;
            toast('Parsed ' + count + ' applicants successfully, starting upload');

            Meteor.call('applicants.insertWithRole', {role: role, applicants: res.applicants}, function(err, updateCount) {
              if (err) {
                toast(err.reason);
              } else {
                toast('Updated ' + updateCount + ' applicants, inserted ' + (count - updateCount) + ' applicants');
              }
              instance.uploading.set(false);
              selectElement.prop('disabled', false);
            });
          }
        });
      }
    });
  }
});

function toast(s) {
  Materialize.toast(s, 4000);
}
