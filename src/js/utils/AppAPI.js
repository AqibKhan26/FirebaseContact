var AppActions = require('../actions/AppActions');
var Firebase = require('firebase');
var config = {
  apiKey: "AIzaSyBF2PtBETYKfhrmrvmWEDxcgZNv0CJt7jg",
  authDomain: "frirebasecontactlist.firebaseapp.com",
  databaseURL: "https://frirebasecontactlist.firebaseio.com",
  storageBucket: "frirebasecontactlist.appspot.com",
};


module.exports = {
	saveContact:function(contact){
		if (!Firebase.apps.length) {
    		Firebase.initializeApp(config);
		}
		this.FirebaseDatabase = Firebase.database();
		this.FirebaseDatabase.ref('/contacts').push({
		    contact: contact
		  });
	},
	getContacts: function(){
		if (!Firebase.apps.length) {
    		Firebase.initializeApp(config);
		}
		this.FirebaseDatabase = Firebase.database();
		this.FirebaseDatabase.ref('/contacts/').once("value").then(function(snapshot){
			var contacts = [];
			snapshot.forEach(function(childSnapshot){
				var contact = {
					id: childSnapshot.key,
					name: childSnapshot.val().contact.name,
					phone: childSnapshot.val().contact.phone,
					email: childSnapshot.val().contact.email
				}
				contacts.push(contact);
				AppActions.recieveContacts(contacts);
			});
		});
	},

	removeContact: function(contactId){
		if (!Firebase.apps.length) {
    		Firebase.initializeApp(config);
		}
		this.FirebaseDatabase = Firebase.database();
		this.FirebaseDatabase.ref('/contacts/'+contactId).remove();
	},

	updateContact:function(contact){
		var id = contact.id;
		var updatedContact = {
			name: contact.name,
			phone: contact.phone,
			email: contact.email
		}
		if (!Firebase.apps.length) {
    		Firebase.initializeApp(config);
		}
		this.FirebaseDatabase = Firebase.database();
		this.FirebaseDatabase.ref('/contacts/'+contact.id+'/contact').update(updatedContact);

	}
}