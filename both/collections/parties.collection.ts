import {Mongo} from 'meteor/mongo';
 
import {Party} from '../interfaces/party.interface';
 
export const Parties = new Mongo.Collection<Party>('parties');

function loggedIn() {
  return !!Meteor.user();
}

function isPartyOwner(userId, doc){
  return !!Meteor.user() && userId == doc.owner;
}
 
Parties.allow({
  insert: loggedIn,
  update: isPartyOwner,
  remove: isPartyOwner
});