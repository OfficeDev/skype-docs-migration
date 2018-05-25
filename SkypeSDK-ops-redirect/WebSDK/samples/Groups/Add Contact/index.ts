/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    window.framework.hideNotificationBar();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTGroupsAddContact.md' : 'Content/websdk/docs/PTGroupsAddContact.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    const groups = {};

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id'));

    window.framework.application.personsAndGroupsManager.all.groups.subscribe();
    window.framework.application.personsAndGroupsManager.all.groups.added(group => {
        group.name.get();
        group.name.changed(value => {
            if (!groups[value] && group.type() !== 'Distribution') {
                const option = document.createElement('option');
                option.value = value;
                option.innerHTML = value;
                content.querySelector('.groupsSelect').appendChild(option);
                groups[value] = group;

            }
        });
    });

    window.framework.application.personsAndGroupsManager.all.groups.removed(group => {
        delete groups[group.name()];
        const option = content.querySelector('.groupsSelect option[value="' + group.name() + '"]');
        content.querySelector('.groupsSelect').removeChild(option);
    });

    function reset() {
        (<HTMLInputElement>content.querySelector('.id')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.add'), 'click', () => {
        const id = (<HTMLInputElement>content.querySelector('.id')).value;
        const group = groups[(<HTMLOptionElement>content.querySelector('.groupsSelect option:checked')).value];
        window.framework.showNotificationBar();
        window.framework.updateNotification('info', 'Adding contact...');
        group.persons.add(id).then(() => {
            window.framework.updateNotification('success', 'Contact added');
        }, error => {
            window.framework.updateNotification('error', error);
        }).then(reset);
    });
})();
