
# Save and restore a snapshot of the Application state


 _**Applies to:** Skype for Business_

The Application allows you to save a snapshot of its state so it can be restored at a later time.


### How to: Save and restore a snapshot of the Application state


1. Sign in to the Application.
    

  ```js
  
  application.signInManager.signIn ({
    username: $('#username').text(),
    password: $('#password').text()
  });

  ```

2. Obtain a snapshot of the Application state.
    

  ```js
  
  var snapshot = application.getSnapshot();
	 
  ```

3. Serialize the snapshot to JSON.
    

  ```js
  
  var snapshotJson = JSON.stringify(snapshot);
	 
  ```

4. Save the snapshot JSON to session storage.
    

  ```js
  
  sessionStorage.setItem('snapshot', snapshot);    
	 
  ```

5. Sign in to an Application object using the snapshot data.
    

  ```js
  
  var promise = client.signInManager.signIn({
    username: $('#username').text(),
    password: $('#password').text(),
    snapshot: JSON.parse(sessionStorage.getItem('snapshot'))
  });  
	 
  ```

The following example demonstrates how to sign in with Skype Web SDK, take a snapshot, save it to the session storage, and then restore the state from that snapshot.



```js

$(function () {
    'use strict';

    var Application
    var client;
    Skype.initialize({
            apiKey: 'SWX-BUILD-SDK',
        }, function (api) {
            Application = api.application;
            client=new Application();
        }, function (err) {
            alert('some error occurred: ' + err);
        });

    if (!sessionStorage.getItem('snapshot'))
        $('#snapshot').hide();

    $('#savesnapshot').on('click', function () {
        var snapshot;

        try {
            // may throw if not signed in
            snapshot = JSON.stringify(client.getSnapshot());
            sessionStorage.setItem('snapshot', snapshot);
            alert('Sanpshot saved to sessionStorage/snapshot. Size: ' + snapshot.length + ' bytes.');
        } catch (err) {
            alert('Cannot take a snapshot: ' + err);
        }
    });

    $('#signin').on('click', function () {
        var promise = client.signInManager.signIn({
            username: $('#username').text(),
            password: $('#password').text(),
            snapshot: $('#usesnapshot').is(':checked') &amp;&amp; JSON.parse(sessionStorage.getItem('snapshot'))
        }).then(function () {
            $('#data').append(
                LabeledProperty('name', client.personsAndGroupsManager.mePerson.name),
                LabeledProperty('title', client.personsAndGroupsManager.mePerson.title),
                LabeledProperty('department', client.personsAndGroupsManager.mePerson.department),
                LabeledProperty('presence', client.personsAndGroupsManager.mePerson.presence),
                LabeledProperty('note', client.personsAndGroupsManager.mePerson.note));

            client.personsAndGroupsManager.all.persons.subscribe();

            client.personsAndGroupsManager.all.persons.added(function (contact) {
                $('#data').append(LabeledProperty('contact', contact.name));
            });
        }).then(null, function (error) {
            alert('Something went wrong: ' + error);
        });

        // monitor the status of sign in
        $('#data').append(LabeledProperty('signin', promise.status));
    });

    function LabeledProperty(label, property) {
        var span = $('<span>');

        property.subscribe();

        property.changed(function (value) {
            span.text(JSON.stringify(value));
        });

        return $('<div>').append($('<span>').text(label), span);
    }
});

```

