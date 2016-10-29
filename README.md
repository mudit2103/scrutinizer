# scrutinizer
A fancier name for "Interviewer". Intended to be used internally for CSM leadership to track applicants, construct interview questions, and record interview responses.

## Setup
1. Get [Meteor](https://www.meteor.com/install)
2. Run `meteor npm install`
3. Run `meteor`. You can keep this running as you make changes; Meteor automatically refreshes the web server.

## File Structure
- `imports/api` - Model layer for object CRUD
- `imports/ui/components` - directories divided by feature name
  - `body` defines overall layout and wraps individual feature templates
    - Global events or helpers should go in `body.js`
  - Feature's controller logic + Blaze template should only go in its directory
  - Feature-specific CSS should go in corresponding folder and be imported by corresponding `.js` file
- `client` - global CSS should go in here. 
- `server` - imports
- [More notes from Meteor docs](https://guide.meteor.com/structure.html)

## Misc.
- [The Blaze docs are here now](http://blazejs.org/guide/introduction.html)
- We are using [Materialize](http://materializecss.com/) for our front-end
