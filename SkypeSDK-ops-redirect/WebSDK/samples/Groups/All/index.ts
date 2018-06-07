/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    window.framework.hideNotificationBar();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTGroupsAll.md' : 'Content/websdk/docs/PTGroupsAll.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    function reset() {
        (<HTMLElement>content.querySelector('.groups')).innerHTML = '';
        (<HTMLElement>content.querySelector('.groups')).style.display = 'none';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.get'), 'click', () => {
        reset();
        const groupsDiv = <HTMLElement>content.querySelector('.groups');
        const application = window.framework.application;
        window.framework.showNotificationBar();
        window.framework.updateNotification('info', 'Retrieving all groups...');
        const groups = application.personsAndGroupsManager.all.groups;
        groups.get().then(groups => {
            groupsDiv.style.display = 'block';
            window.framework.populateGroups(groups, groupsDiv);
            window.framework.updateNotification('success', 'Retrieved all groups');
        }, error => {
            window.framework.updateNotification('error', error);
        });
    });
})();
