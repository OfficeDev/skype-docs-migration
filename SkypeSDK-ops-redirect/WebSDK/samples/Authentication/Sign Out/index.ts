/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAuthSignOut.md' : 'Content/websdk/docs/PTAuthSignOut.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    const updateAuthenticationList = () => {
        const sidebar: Element = document.getElementsByClassName('sidebar')[0];
        const abc: any = sidebar.childNodes[0].childNodes[0].childNodes[0].childNodes[1];
        abc.childNodes[0].removeAttribute('style');
        abc.childNodes[1].removeAttribute('style');
        abc.childNodes[2].removeAttribute('style');
        abc.childNodes[3].removeAttribute('style');
        abc.childNodes[5].style.display = 'none';
        abc.childNodes[6].style.display = 'none';
    }

    window.framework.addEventListener(content.querySelector('.signout'), 'click', () => {
        document.getElementsByClassName('azuread-signin')[0].getElementsByTagName('text')[0].innerHTML = "Signing Out...";
        (<HTMLElement>document.getElementsByClassName('content')[0]).style.display = 'none';
        (<HTMLElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'block';
        const application = window.framework.application;
        // (document.getElementsByClassName('notification3')[0] as any).style.display = 'block';
        // window.framework.reportStatus('Signing Out...', window.framework.status.info);
        // @snippet
        application.signInManager.signOut().then(() => {
            // window.framework.reportStatus('Signed Out', window.framework.status.success);
            (document.getElementsByClassName('before-signin')[0] as any).style.display = 'block';
            (document.getElementsByClassName('after-signin')[0] as any).style.display = 'none';
            document.getElementsByClassName('azuread-signin')[0].getElementsByTagName('text')[0].innerHTML = "You've successfully signed out";
            document.getElementsByClassName('azuread-signin')[0].getElementsByTagName('span')[0].style.display = 'none';
            (<HTMLElement>document.getElementsByClassName('content')[0]).style.display = 'block';
            updateAuthenticationList();
        }, error => {
            window.framework.reportError(error);
        });
        // @end_snippet
    });
})();
