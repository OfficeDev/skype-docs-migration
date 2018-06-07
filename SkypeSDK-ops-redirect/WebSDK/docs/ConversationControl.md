
# Conversation Control

 _**Applies to:** Skype for Business_

Conversation Control members consist of: 

- Properties that return an application instance. 
- A method that renders the control in the page.

## Properties

The following table lists the properties of the  **Conversation Control** object.


||||
|:-----|:-----|:-----|
|**Property**|**Description**|**Returns**|
| _UIApplicationInstance_|Returns the instance of Skype Web SDK Application used by renderConversation API|[Application]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.application.html)|

### Methods

The following table lists the methods of the  **Conversation Control** object.


||||
|:-----|:-----|:-----|
|**Method**|**Description**|**Returns**|
| _renderConversation_|Render a conversation in given context <br/>  **Parameters** <br/> - _container_  - (**String/DOMelement** ) Mandatory. A CSS selector or DOM element <br />- _state_  - **Object**  Optional. Object holding the optional parameters<br />- _state.participants_  - **Array**  Optional. Array of participants to start a conversation with.<br />- _state.conversation_  - **Object**  Optional.  Conversation object to render.<br/>- _state.conversationId_  - **String**  Optional.  Id/Uri of the group conversation to render.<br/> Use only one of participants, conversation or conversationId.<br/>- _modalities_  - **Array**  Optional. Array of modalities to start.<br />|[Promise]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.promise.html)|

### Examples

The following examples show the most common uses of the  **renderConversation** method. 

>Note: The HTML container that contains the conversation control must have a width and height set. If width and height are
set to zero, the conversation control does not display. 
```html
<div id="container" style="width:864px; height: 900px">
</div>
```

#### Render a new conversation with no modalities enabled, and passing DOM element as container parameter.

After the control is rendered the user can then click on the Add participants button and add people to the conversation.

```js
renderConversation(document.querySelector('#container'));
```

#### Render a new conversation with Chat modality enabled

After the control is rendered the user can then click on the Add participants button and add people to the conversation.

```js
renderConversation('#container', {
     modalities: ['Chat']
});
```

#### Render a 1:1 conversation

If the sdk finds an existing conversation with that person, then that conversation will be reused. If not, a new conversation is created.

```js
renderConversation('#container', {
     participants: ['sip:denisd@contoso.com']
});

```

#### Render a 1:1 conversation with Chat modality

If the sdk finds an existing conversation with that person, then that conversation will be reused. If not, a new conversation is created.


```js
renderConversation('#container', {
     participants: ['sip:denisd@contoso.com'],
     modalities: ['Chat']
});

```


#### Render a new group conversation with Chat modality

This will render a new group conversation even if an existing group conversation with the same set of remote participants already exists.

```js
renderConversation('#container', {
     participants: ['sip:remote1@contoso.com', 'sip:remote2@contoso.com'],
     modalities: ['Chat']
});

```


#### Join and render an existing group or P2P conversation with Chat modality using conversation object

This will render an existing group or p2p conversation with using the conversation object.
Do not include the participants array, otherwise it will create a new group conversation.

```js
renderConversation('#container', {
     conversation: conversation,
     modalities: ['Chat']
});

```

#### Join and render an existing group conversation with Chat modality using conversationId

This will find an existing group conversation with the given uri and render that conversation.
Do not include the participants array, otherwise it will create a new group conversation.

```js
// Get the uri of an existing group conversation
// eg. sip:user@contoso.com;gruu;opaque=app:conf:focus:id:EXAMPLE
var uri = conversation.uri();

renderConversation('#container', {
     conversationId: uri,
     modalities: ['Chat']
});

```
