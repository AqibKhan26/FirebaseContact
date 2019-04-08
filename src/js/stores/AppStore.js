var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppAPI = require('../utils/AppAPI.js');

var CHANGE_EVENT = 'change';

var _contacts = [];
var _contact_to_edit = '';

var AppStore = assign({}, EventEmitter.prototype, {
	saveContact:function(contact){
		_contacts.push(contact);
	},
	getContacts:function(contact){
		return _contacts;
	},
	setContacts:function(contacts){
		_contacts = contacts;
	},
	removeContact:function(contactId){
		var index = _contacts.findIndex(x=> x.id === contactId);
		_contacts.splice(index,1);
	},
	getContactToEdit:function(){
		return _contact_to_edit;
	},
	updateContact:function(contact){
		for(i=0;i< _contacts.length;i++){
			if(_contacts[i].id == contact.id){
				_contacts.splice(i,1);
				_contacts.push(contact);
			}
		}
	},
	setContactToEdit:function(contact){
		_contact_to_edit = contact;
	},
	emitChange: function(){
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback){
		this.on('change', callback);
	},
	removeChangeListener: function(callback){
		this.removeListener('change', callback);
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;

	switch(action.actionType){
		case AppConstants.SAVE_CONTACT:
			console.log('Saving contact...');

			//store save
			AppStore.saveContact(action.contact);

			//save to api
			AppAPI.saveContact(action.contact);
			//emit change
			AppStore.emit(CHANGE_EVENT);
			break;

		case AppConstants.RECIEVE_CONTACTS:
			console.log('Receiving contact...');

			//store save
			AppStore.setContacts(action.contacts);

			//emit change
			AppStore.emit(CHANGE_EVENT);
			break;

		case AppConstants.REMOVE_CONTACT:
			console.log('Removing contact...');

			//store remove
			AppStore.removeContact(action.contactId);

			//APi remove
			AppAPI.removeContact(action.contactId);

			//emit change
			AppStore.emit(CHANGE_EVENT);
			break;

		case AppConstants.EDIT_CONTACT:

			//store save
			AppStore.setContactToEdit(action.contact);

			//emit change
			AppStore.emit(CHANGE_EVENT);
			break;

		case AppConstants.UPDATE_CONTACT:
			console.log('Updating contact...');

			//store update
			AppStore.updateContact(action.contact);

			//APi update
			AppAPI.updateContact(action.contact);

			//emit change
			AppStore.emit(CHANGE_EVENT);
			break;
		
	}

	return true;
});

module.exports = AppStore;