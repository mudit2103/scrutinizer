import './reviewRow.html';

Template.reviewRow.helpers({
  formattedRoles() {
    var formatted = '';
    _.each(this.roles, function(role) {
      formatted += role.role_id + ', ';
    });
    return formatted.substring(0, formatted.length - 2);
  }
});