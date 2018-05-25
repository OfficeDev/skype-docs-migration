/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAuthWindowsAuth.md' : 'Content/websdk/docs/PTAuthWindowsAuth.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.domain'));

    function reset () {
        (<HTMLInputElement>content.querySelector('.domain')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.signin'), 'click', () => {
        const version = config.version;
        const domain = (<HTMLInputElement>content.querySelector('.domain')).value;
        const api = window.framework.api;
        document.getElementsByClassName('azuread-signin')[0].getElementsByTagName('text')[0].innerHTML = "Verifying credentials & Signing-in...";
        (<HTMLElement>document.getElementsByClassName('before-signin-wa')[0]).style.display = 'none';
        (<HTMLElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'block';
        const application = api.UIApplicationInstance;
        application.signInManager.signIn({
            version: version,
            domain: domain
        }).then(() => {
            (<HTMLInputElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'none';
            (<HTMLInputElement>document.getElementsByClassName('after-signin-wa')[0]).style.display = 'block';
            window.framework.updateAuthenticationList();
        }, error => {
            (<HTMLInputElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'none';
            (<HTMLInputElement>document.getElementsByClassName('after-signin-error-wa')[0]).style.display = 'block';
        }).then(reset);
        window.framework.application = application;
    });
})();
