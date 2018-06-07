/* Copyright (C) Microsoft 2014. All rights reserved. */
var domain = "https://www.example.com",
targetOrigin = "https://www.myDomain.com",
element = $("#frame")[0].contentWindow,
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin);

Transport.setElement(element, domain);
Transport.setAuthorization("cwt=AAEBHAEFAAAAAAAFFQAAACZfw6hMpZ-w7RAMgdAEAACBEPDttJWHCThQn95OJLXgmL2CAvrFgyAMij1C0fFgd9JBx2_VpSjC0fUJFOK02BUWty33xAQH34YIAieH80cSzwg", "Bearer");

Transport.injectFrame(domain, element.parent(), function() {
    alert("iframe has been loaded");
});