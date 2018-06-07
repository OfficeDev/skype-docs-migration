/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAuthPassword.md' : 'Content/websdk/docs/PTAuthPassword.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.username'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.password'));

    function reset () {
        (<HTMLInputElement>content.querySelector('.username')).value = '';
        (<HTMLInputElement>content.querySelector('.password')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.signin'), 'click', () => {
        const version = config.version;
        const username = (<HTMLInputElement>content.querySelector('.username')).value;
        const password = (<HTMLInputElement>content.querySelector('.password')).value;
        const api = window.framework.api;
        document.getElementsByClassName('azuread-signin')[0].getElementsByTagName('text')[0].innerHTML = "Verifying credentials & Signing-in...";
        (<HTMLElement>document.getElementsByClassName('before-signin-pwd')[0]).style.display = 'none';
        (<HTMLElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'block';
        const application = api.UIApplicationInstance;
        application.signInManager.signIn({
            version: version,
            username: username,
            password: password
        }).then(() => {
            (<HTMLInputElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'none';
            (<HTMLInputElement>document.getElementsByClassName('after-signin-pwd')[0]).style.display = 'block';
            window.framework.updateAuthenticationList();
        }, error => {
            (<HTMLInputElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'none';
            (<HTMLInputElement>document.getElementsByClassName('after-signin-error-pwd')[0]).style.display = 'block';
        }).then(reset);
        window.framework.application = application;
    });
})();
