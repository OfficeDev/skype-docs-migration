
# Caching
To improve efficiency, web applications should cache important or often-used resources.


 _**Applies to:** Skype for Business 2015_

The resources that UCWA 2.0 serves can be short-lived or long-lived, and can be dynamic (by sending events on the event channel) or static. The types of events that a UCWA 2.0 resource can send depend on the type of resource. For example, operation resources such as [messagingInvitation](messagingInvitation_ref.md) can send events of type started, updated, or completed. Other types of resources can send events that indicate that the resource has been added, updated, or deleted.

Events enable an application to discover when resources come into being and go out of existence, and provide information about their intermediate state transitions. Applications can use event information to manage their system resources efficiently, and to update their user interfaces.
An application should implement an application-level cache for UCWA 2.0 resources that encapsulates interactions between the upper layer and HTTP level resources. To utilize bandwidth more effectively, applications should cache resources, so that they do not need to refetch a resource that was previously fetched. Reducing multiple fetches of a given resource results in savings on bandwidth and processing power for the client, and reduces server load. UCWA 2.0 offers some guidance in the form of Expires and Cache-Control headers to enforce caching on intermediate proxies, but that is not possible for resources that are very dynamic in nature.
