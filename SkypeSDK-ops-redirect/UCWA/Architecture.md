
# Architecture
Learn about the Skype for Business Server architecture as it relates to Microsoft Unified Communications Web API 2.0.


 _**Applies to:** Skype for Business 2015_

Skype for Business Server provides to enterprises a suite of platforms and solutions to make it easier to connect people for communication and collaboration. A new component of Skype for Business Server is the Microsoft Unified Communications Web API 2.0 service. The API for this service exposes Lync features through the HTTP protocol.


**The UCWA architecture in a Skype for Business Server 2015 deployment**


![UCWA architecture in a Lync Server 2013 deployment](images/UCWA15Con_ArchitectureTopology.png)

The illustration shows the UCWA 2.0 architecture in Skype for Business Server 2015 deployment at a high level. Some of the components that are involved are:


- **UCWA** powers real-time communications for mobile and web clients in Skype for Business Server 2015. This web component is deployed on all roles as a web component.
 
- **Autodiscovery** allows a client to detect the web entry point; that is, the UCWA 2.0 home pool/server for a specific user. The client connects to the Discovery service, which provides the FQDN of the user's home server pool. After the user "discovers" the home server, the user can interact with UCWA 2.0.
 
- **Mediation server** is used to enable Phone Audio for UCWA 2.0.
 

## UCWA interaction with Skype for Business Server

The following illustration shows how UCWA 2.0 fits into the Skype for Business Server architecture.


**How a UCWA application interacts with Skype for Business Server 2015**

![How a UCWA application interacts with Lync Server 2013](images/UCWA15Con_HomeServerArch.png)

All web traffic flows through the Web Infra layer that is responsible for authentication as well as throttling. This layer is also responsible for proxying traffic to the next hop server; that is, the user's home server. 

After the home server is located, a UCWA 2.0 web application interacts with UCWA 2.0 by using the HTTP protocol. For more information, see [Create an application](CreateAnApplication.md).

