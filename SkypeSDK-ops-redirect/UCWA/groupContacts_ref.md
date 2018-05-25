# groupContacts

 _**Applies to:** Skype for Business 2015_


A collection of contact resources that belong to a particular group resource.
            

## Web Link
<a name = "sectionSection0"> </a>

For more on web links, see [Web links](WebLinks.md).


|**Name**|**Description**|
|:-----|:-----|
|rel|The resource that this link points to. In JSON, this is the outer container.|
|href|The location of this resource on the server, and the target of an HTTP operation.|

### Properties



None

### Links



This resource can have the following relationships.

|**Link**|**Description**|
|:-----|:-----|
|self|The link to the current resource.|
|contact|Represents a person or service that the user can communicate and collaborate with.|
|contact|Represents a person or service that the user can communicate and collaborate with.|

### Azure Active Directory scopes for online applications



The user must have at least one of these scopes for operations on the resource to be allowed.
|**Scope**|**Permission**|**Description**|
|:-----|:-----|:-----|
|User.ReadWrite|Read/write Skype user information|Allows the app to read and update presence, photo, location, note, call forwarding settings of the signed-in user|
|Contacts.ReadWrite|Read/write Skype user contacts and groups|Allows the app to read and write Skype user contacts and groups|
|Conversations.Initiate|Initiate conversations and join meetings|Allows the app to initiate instant messages, audio, video, and desktop sharing conversations; and join meetings on-behalf of the signed-in user|
|Conversations.Receive|Receive conversation invites|Allows the app to receive instant messages, audio, video, and desktop sharing invitations on-behalf of the signed-in user|
|Meetings.ReadWrite|Create Skype Meetings|Allows the app to create Skype meetings on-behalf of the signed-in user|

## Events
<a name="sectionSection2"></a>

### Added



|**Resource**|**Priority**|**Sender**|**Reason**|
|:-----|:-----|:-----|:-----|
|contact|High|people|Delivered when a contact resource is added.</p><p></p>|
Sample of returned event data.
This sample is given only as an illustration of event syntax. The semantic content is not guaranteed to correspond to a valid scenario.
{
  "_links" : {
    "self" : {
      "href" : "http://sample:80/ucwa/v1/applications/appId/events?ack=1"
    },
    "next" : {
      "href" : "http://sample:80/ucwa/v1/applications/appId/events?ack=2"
    }
  },
  "sender" : [
    {
      "rel" : "people",
      "href" : "https://fe1.contoso.com:443/ucwa/v1/applications/192/people",
      "events" : [
        {
          "link" : {
            "rel" : "contact",
            "href" : "https://fe1.contoso.com:443/ucwa/v1/applications/192/people/282"
          },
          "in" : {
            "rel" : "myContacts",
            "href" : "https://fe1.contoso.com:443/ucwa/v1/applications/192/contacts"
          },
          "type" : "added"
        }
      ]
    }
  ]
}


### Deleted



|**Resource**|**Priority**|**Sender**|**Reason**|
|:-----|:-----|:-----|:-----|
|contact|High|people|Delivered when a contact resource is deleted.</p><p></p>|
Sample of returned event data.
This sample is given only as an illustration of event syntax. The semantic content is not guaranteed to correspond to a valid scenario.
{
  "_links" : {
    "self" : {
      "href" : "http://sample:80/ucwa/v1/applications/appId/events?ack=1"
    },
    "next" : {
      "href" : "http://sample:80/ucwa/v1/applications/appId/events?ack=2"
    }
  },
  "sender" : [
    {
      "rel" : "people",
      "href" : "https://fe1.contoso.com:443/ucwa/v1/applications/192/people",
      "events" : [
        {
          "link" : {
            "rel" : "contact",
            "href" : "https://fe1.contoso.com:443/ucwa/v1/applications/192/people/282"
          },
          "in" : {
            "rel" : "myContacts",
            "href" : "https://fe1.contoso.com:443/ucwa/v1/applications/192/contacts"
          },
          "type" : "deleted"
        }
      ]
    }
  ]
}


## Operations



<a name="sectionSection2"></a>

### GET




Gets the list of contacts belonging to this group.

#### Query parameters




|**Name**|**Description**|**Required?**|
|:-----|:-----|:-----|
|expand|Optional query parameter to override default behavior when returning a collection of groups. Bydefault, a collection of all contact list groups will be returned with data inline. If this queryparameter is provided in the request with value of "false", then the collection of contact listgroups will be returned as links.|No|


#### Request body



None


#### Response body



The response from a GET request contains the properties and links shown in the Properties and Links sections at the top of this page.

#### Synchronous errors



The errors below (if any) are specific to this resource. Generic errors that can apply to any resource are covered in [Generic synchronous errors](GenericSynchronousErrors.md).

|**Error**|**Code**|**Subcode**|**Description**|
|:-----|:-----|:-----|:-----|
|Forbidden|403|None|The user does not have sufficient privileges to access the contact list.|
|Forbidden|403|None|The user does not have sufficient privileges to access pending contacts|
|ServiceFailure|500|InvalidExchangeServerVersion|Invalid exchange server version.The exchange mailbox of the server might have moved to an unsupported version for the required feature.|
|Conflict|409|AlreadyExists|The already exists error.|
|Conflict|409|TooManyGroups|The too many groups error.|
|Conflict|409|None|Un-supported Service/Resource/API error.|
|Gone|410|CannotRedirect|Cannot redirect since there is no back up pool configured.|

#### Examples



Only server-supplied query parameters, if any, are shown in the request sample.

#### JSON Request




```
Get https://fe1.contoso.com:443/ucwa/v1/applications/192/contacts?groupId=samplevalue HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com
Accept: application/json

```


#### JSON Response



This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1280
{
  "rel" : "groupContacts",
  "_links" : {
    "self" : {
      "href" : "/ucwa/v1/applications/192/contacts"
    },
    "contact" : [
      {
        "href" : "/ucwa/v1/applications/192/people/608"
      }
    ]
  },
  "_embedded" : {
    "contact" : [
      {
        "rel" : "contact",
        "company" : "Contoso Corp.",
        "department" : "Engineering",
        "emailAddresses" : [
          "Alex.Doe@contoso.com"
        ],
        "homePhoneNumber" : "tel:+19185550107",
        "sourceNetworkIconUrl" : "https://images.contoso.com/logo_16x16.png",
        "mobilePhoneNumber" : "tel:4255551212;phone-context=defaultprofile",
        "name" : "Alex Doe",
        "office" : "tel:+1425554321;ext=54321",
        "otherPhoneNumber" : "tel:+19195558194",
        "sourceNetwork" : "SameEnterprise",
        "title" : "Engineer 2",
        "type" : "User",
        "uri" : "sip:alex@contoso.com",
        "workPhoneNumber" : "tel:+1425554321;ext=54321",
        "_links" : {
          "self" : {
            "href" : "/ucwa/v1/applications/192/people/282"
          },
          "contactLocation" : {
            "href" : "/ucwa/v1/applications/192/people/282/contactLocation"
          },
          "contactNote" : {
            "href" : "/ucwa/v1/applications/192/people/282/contactNote"
          },
          "contactPhoto" : {
            "href" : "/ucwa/v1/applications/192/people/282/contactPhoto"
          },
          "contactPresence" : {
            "href" : "/ucwa/v1/applications/192/people/282/contactPresence"
          },
          "contactPrivacyRelationship" : {
            "href" : "/ucwa/v1/applications/192/people/282/contactPrivacyRelationship"
          },
          "contactSupportedModalities" : {
            "href" : "/ucwa/v1/applications/192/people/282/contactSupportedModalities"
          }
        }
      }
    ]
  }
}
```


#### XML Request




```
Get https://fe1.contoso.com:443/ucwa/v1/applications/192/contacts?groupId=samplevalue HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com
Accept: application/xml

```


#### XML Response



This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.
```
HTTP/1.1 200 OK
Content-Type: application/xml
Content-Length: 1816
<?xml version="1.0" encoding="utf-8"?>
<resource rel="groupContacts" href="/ucwa/v1/applications/192/contacts" xmlns="http://schemas.microsoft.com/rtc/2012/03/ucwa">
  <link rel="contact" href="/ucwa/v1/applications/192/people/650" />
  <property name="rel">groupContacts</property>
  <resource rel="contact" href="/ucwa/v1/applications/192/people/282">
    <link rel="contactLocation" href="/ucwa/v1/applications/192/people/282/contactLocation" />
    <link rel="contactNote" href="/ucwa/v1/applications/192/people/282/contactNote" />
    <link rel="contactPhoto" href="/ucwa/v1/applications/192/people/282/contactPhoto" />
    <link rel="contactPresence" href="/ucwa/v1/applications/192/people/282/contactPresence" />
    <link rel="contactPrivacyRelationship" href="/ucwa/v1/applications/192/people/282/contactPrivacyRelationship" />
    <link rel="contactSupportedModalities" href="/ucwa/v1/applications/192/people/282/contactSupportedModalities" />
    <property name="rel">contact</property>
    <property name="company">Contoso Corp.</property>
    <property name="department">Engineering</property>
    <propertyList name="emailAddresses">
      <item>Alex.Doe@contoso.com</item>
    </propertyList>
    <property name="homePhoneNumber">tel:+19185550107</property>
    <property name="sourceNetworkIconUrl">https://images.contoso.com/logo_16x16.png</property>
    <property name="mobilePhoneNumber">tel:4255551212;phone-context=defaultprofile</property>
    <property name="name">Alex Doe</property>
    <property name="office">tel:+1425554321;ext=54321</property>
    <property name="otherPhoneNumber">tel:+19195558194</property>
    <property name="sourceNetwork">SameEnterprise</property>
    <property name="title">Engineer 2</property>
    <property name="type">User</property>
    <property name="uri">sip:alex@contoso.com</property>
    <property name="workPhoneNumber">tel:+1425554321;ext=54321</property>
  </resource>
</resource>
```


