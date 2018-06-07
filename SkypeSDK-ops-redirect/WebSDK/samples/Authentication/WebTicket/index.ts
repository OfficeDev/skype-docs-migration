/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAuthWebTicket.md' : 'Content/websdk/docs/PTAuthWebTicket.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.webTicket'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.domain'));

    function reset () {
        (<HTMLInputElement>content.querySelector('.webTicket')).value = '';
        (<HTMLInputElement>content.querySelector('.domain')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.signin'), 'click', () => {
        const version = config.version;
        const webTicket = (<HTMLInputElement>content.querySelector('.webTicket')).value;
        const domain = (<HTMLInputElement>content.querySelector('.domain')).value;
        const api = window.framework.api;
        window.framework.reportStatus('Signing In...', window.framework.status.info);
        // @snippet
        const application = api.UIApplicationInstance;
        application.signInManager.signIn({
            version: version,
            auth: (req, send) => {
                req.headers['Authorization'] = webTicket;
                return send(req);
            },
            domain: domain
        }).then(() => {
            window.framework.reportStatus('Signed In', window.framework.status.success);
        }, error => {
            window.framework.reportError(error);
        }).then(reset);
        // @end_snippet
        window.framework.application = application;
    });
})();
