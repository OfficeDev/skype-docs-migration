
# Presence


 _**Applies to:** Skype for Business 2015_

 **In this article**<br/>
[Availability](#sectionSection0)<br/>
[Personal Note](#sectionSection1)<br/>
[Activity](#sectionSection2)<br/>
[User presence](#sectionSection3)<br/>
[Presence Subscription](#sectionSection4)


 A user's presence is a collection of information about the user's availability, their current activity, and their personal note. Use presence information to help users decide whether and how they should person other users. To increase effectiveness of user communication, combine presence information with other business-specific information about an individual, like job title and team membership.

## Availability
<a name="sectionSection0"> </a>

This list shows the default availability settings. The vertical color-coded bar and text on the person's listing indicates their availability.


- online
    
- busy
    
- do not disturb
    
- be right back
    
- off work
    
- appear away
    

## Personal Note
<a name="sectionSection1"> </a>

The personal note is the content of the note box for the signed-in user. The signed-in user can add a personal note or greeting that people can see alongside their presence information. The note can include up to 500 characters, and the user can change the note as often as they like.


## Activity
<a name="sectionSection2"> </a>

Activity describes what the user is currently doing that effects their availability. For example, a user's availability may be busy and their activity might be "in a meeting." A user's availability can be free and their activity can be "Available". Activity strings can be customized. 


## User presence
<a name="sectionSection3"> </a>

In real-time communications, user presence is information that describes a user's availability status. For example, Skype for Business displays a list of your persons and status indicating if a person is available, busy, inactive, away, or offline. User presence is the availability and willingness of a person to join a conversation. For example, you may leave a personal note to inform others of your current traveling itinerary and to provide them with a list of alternative communications means to reach you in case of emergency. Use presence to see if you can start a Skype Web SDK conversation with a user or reach the user by an alternate means. When a person's status shows available, you know that the person is likely to answer your IM or voice call. A busy or inactive person is less likely to respond to your invitation. An away or offline status suggests that you should send the person an email message instead of IM text. The Skype Web SDK enhances this basic presence by giving you access to the following kinds of person information:


- User name
    
- Job title
    
- Email address
    
- Work phone number
    
- Company name
    
- Department name
    
- Photo
    
- Location
    
- Personal note or out-of-office note published by a Skype for Business user
    
A user is encapsulated by a read-only Person object. The presence information in the previous list is available as a set of properties of the Person object.


## Presence Subscription
<a name="sectionSection4"> </a>

A presence subscription on a Person object is a request on server to provide continual updates to a user's presence. A presence update generates an event on the associated Person object whenever a user changes a presence value such as availability or personal note. A unique presence subscription is created for each person that you display in your UI. You can cancel a presence subscription for a given person at any time. Normally presence subscriptions are cancelled when a subscribed person is no longer shown on your UI. Note that cancelling unnecessary presence subscriptions can improve application performance.

