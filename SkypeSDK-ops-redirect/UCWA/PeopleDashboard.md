
# People dashboard
The **people** resource acts as a dashboard that represents the user's contacts.


 _**Applies to:** Skype for Business 2015_

 
The [people](people_ref.md) resource keeps the application updated with all the activities involving the people the user cares about.

## Resource representation
<a name="sectionSection0"> </a>

The following table contains a representation of the **people** resource.


**Property bag**
```
"rel" : "people"
```


**Link**
```
"self" : {
 "href" : "/ucwa/v1/applications/105/people"
},
"myContactsAndGroupsSubscription" : {
 "href" : "/ucwa/v1/applications/105/people/myContactsAndGroupsSubscription"
},
"myContacts" : {
 "href" : "/ucwa/v1/applications/105/contacts"
},
"myGroupMemberships" : {
 "href" : "/ucwa/v1/applications/105/myGroupMemberships"
},
"myGroups" : {
 "href" : "/ucwa/v1/applications/105/groups"
},
"myPrivacyRelationships" : {
 "href" : "/ucwa/v1/applications/105/myPrivacyRelationships"
},
"presenceSubscriptionMemberships" : {
 "href" : "/ucwa/v1/applications/105/presenceSubscriptionMemberships"
},
"presenceSubscriptions" : {
 "href" : "/ucwa/v1/applications/105/presenceSubscriptions"
},
"search" : {
 "href" : "/ucwa/v1/applications/105/search"
},
"subscribedContacts" : {
 "href" : "/ucwa/v1/applications/105/subscribedContacts"
}

```



## myContactsAndGroupsSubscription
<a name="sectionSection1"> </a>

A [myContactsAndGroupsSubscription](myContactsAndGroupsSubscription_ref.md) resource contains information about the subscription to a user's contacts and groups. This is used to receive events when users are added to or removed from the contact list or individual groups.


## myContacts
<a name="sectionSection2"> </a>

A [myContacts](myContacts_ref.md) resource is a collection of [contact](contact_ref.md) resources that the user has on her contact list. A contact resource is identified by its URI. Details for a contact can be retrieved by making a request on its URI. A contact can be a user, a phone or a bot.


## myGroupMemberships
<a name="sectionSection3"> </a>

A [myGroupMemberships](myGroupMemberships_ref.md) resource is a collection of [myPrivacyRelationship](myPrivacyRelationship_ref.md) resources, each of which is a pair that uniquely links a contact to a group. This is an alternative view of contacts and groups.


## myGroups
<a name="sectionSection4"> </a>

A [myGroups](myGroups_ref.md) resource represents all of the groups on a user's contact list. An individual group can be retrieved by making a request on its URI.


## myPrivacyRelationships
<a name="sectionSection5"> </a>

A [myPrivacyRelationships](myPrivacyRelationships_ref.md) resource represents the various privacy relationships that the user maintains with his or her contacts. Use the [contactPrivacyRelationship](contactPrivacyRelationship_ref.md) resource to set privacy levels for individual contacts. By assigning appropriate privacy levels, the user can restrict the amount of information that the other contact can see. The user may even completely block a contact. In this case, she will not receive any incoming calls from that contact. The contactPrivacyRelationship resource gives the list of privacy levels of all the contacts in a contact list, and gives the privacy level of a single contact.


## presenceSubscriptionMemberships
<a name="sectionSection6"> </a>

A [presenceSubscriptionMemberships](presenceSubscriptionMemberships_ref.md) resource is a collection of [presenceSubscriptionMembership](presenceSubscriptionMembership_ref.md) resources, each of which is a pair that uniquely links a contact to a presence subscription. This is an alternative view of contacts and subscriptions.


## presenceSubscriptions
<a name="sectionSection7"> </a>

A [presenceSubscriptions](presenceSubscriptions_ref.md) resource is used to create and manage subscriptions to the presence of contacts. These contacts do not have to be in the user's contact list.


## search
<a name="sectionSection8"> </a>

The [search](search_ref.md) resource is used to search for contacts.


## subscribedContacts
<a name="sectionSection9"> </a>

A [subscribedContacts](subscribedContacts_ref.md) resource is a collection of contacts for which the logged-on user has created active presence subscriptions.

