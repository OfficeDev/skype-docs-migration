/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAuthAzureAD.md' : 'Content/websdk/docs/PTAuthAzureAD.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var tt = content.querySelector('zero-md');

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.client_id'));

    (<HTMLInputElement>content.querySelector('.reply_url')).value = window.location.href.replace('#', '');

    function reset () {
        (<HTMLInputElement>content.querySelector('.client_id')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.signin'), 'click', () => {
        (<HTMLElement>document.getElementsByClassName('content')[0]).style.display = 'none';
        (<HTMLElement>document.getElementsByClassName('azuread-signin')[0]).style.display = 'block';
        var client_id = (<HTMLInputElement>content.querySelector('.client_id')).value;
        // @snippet
        window.sessionStorage.setItem('client_id', client_id);

        var href = 'https://login.microsoftonline.com/common/oauth2/authorize?response_type=token&client_id=';
        href += client_id + '&resource=https://webdir.online.lync.com&redirect_uri=' + window.location.href;

        window.location.href = href;
        // @end_snippet
    });
})();