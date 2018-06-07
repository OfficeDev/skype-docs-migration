# **Trusted Application API (Public Preview)**

>Note: The Trusted Application API is in Developer Preview and not licensed for production usage.  As part of Microsoft’s [intellgent communications vision](https://aka.ms/intelligentcommunicationsblog), we’re building extensible communications capabilities into Teams.  For more Teams Developer information, check out [https://aka.ms/TeamsDeveloper](https://aka.ms/TeamsDeveloper)

The **Trusted Application API** is a Rest API that enables developers to build Skype for Business Online back-end communications services for the cloud.

Built on the Skype for Business Online Platform, the **Trusted Application API** lets a developer build immersive, smart, and interactive communication experiences and trusted services.

The **Trusted Application API** is our vision of an extensible Skype for Business Online Cloud that meets your demand for powerful, back-end features.  The API aims to provide developer opportunities similar to Skype for Business Server's Unified Communications Managed API (UCMA)...in the cloud. The API enables a cloud-first approach and additional powerful features that aren't available to on-premises Skype for Business Server customers through UCMA.

Key use cases for the **Trusted Application API** include: 

- Write SFB Online applications as service endpoints that don't need need a user context or identity. Common service endpoint scenarios include: 

  - **Meeting Management:** 
     - Schedule or manage on-demand meetings like a contact center application.
     - Create on demand meetings to handle customer calls and add customer service representatives to the meeting.
  - **Attendant console:** 
     - Voice based call answering and routing bots.
  - **Value Add solutions:**
     - Business-to-consumer Remote Advisor functionality like Telehealth appointments or Banking consults
     - Recording
     - Compliance
  - **Customer care:**
     - Click-to-chat
     - Click-to-call

Other such applications include but are not limited to:
 
- Bots and Notifications
- Anonymous Customer Web Chat
- PSTN audio conferencing (IVR to join the conference, in-meeting Personal Virtual Assistant, and in-meeting announcements)
- Service-side meeting recording 
- Inbound/outbound IVRs
- Helpdesk
- Expert-finder
- Customer engagement / Contact Center

To show the power of the **Trusted Application API**, it may also be used for the following high-privilege scenarios:
 
- Back-to-backing calls to conceal the identities of customer service representative in a B2C call.
- Invisibly monitor an online meeting and its roster while keeping full control over conference actions including:
  - Managing real-time media routes for silent monitoring
  - Coaching scenarios and broadcasting in a conference.
- Pop or insert calls in a call pit.
- Use large amounts of computation-intensive real time resources for Voice/Video playback, recording, speech synthesis or recognition.

## In this section

- [Enabling communications services for the cloud](./Trusted_Application_API_GeneralReference.md)
- [Developing Trusted Application API applications for Skype for Business Online](./DevelopingApplicationsforSFBOnline.md)

## Additional Background for Developers

Learning how to use the **Trusted Application API** is simpler if you are familiar with RESTful programming concepts and real-time communications with Skype for Business.  The following topics give you the information you need to get familiar with these API concepts.

- [The Unified Communications Web API (UCWA)](https://ucwa.skype.com)
- [Key programming concepts - UCWA](https://ucwa.skype.com/documentation/key-programming-concepts)
- [UCWA API Reference](https://msdn.microsoft.com/en-us/skype/ucwa/ucwa2_0apireference)
- [The Unified Communications Managed API (UCMA)](https://msdn.microsoft.com/en-us/library/office/dn454984.aspx)
