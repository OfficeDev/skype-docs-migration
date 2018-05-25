/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTContactsContactCard.md' : 'Content/websdk/docs/PTContactsContactCard.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.query'));

    function reset() {
        (<HTMLInputElement>content.querySelector('.query')).value = '';
        (<HTMLElement>content.querySelector('.contacts')).innerHTML = '';
        (<HTMLElement>content.querySelector('.contactcard')).innerHTML = '';
        (<HTMLElement>content.querySelector('.contacts')).style.display = 'none';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.search'), 'click', () => {
        (<HTMLElement>content.querySelector('.contacts')).innerHTML = '';
        (<HTMLElement>content.querySelector('.contactcard')).innerHTML = '';
        const query = (<HTMLInputElement>content.querySelector('.query')).value;
        const contactsDiv = <HTMLElement>content.querySelector('.contacts');
        const application = window.framework.application;
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'block';
        window.framework.updateNotification('info', 'Searching for contact...');

        if (!query) {
            window.framework.updateNotification('error', 'Please enter a user');
            return false;
        }

        const search = application.personsAndGroupsManager.createPersonSearchQuery();
        search.text(query);
        search.limit(1);
        search.getMore().then(() => {
            reset();
            const contacts = search.results();
            if (contacts.length !== 0) {
                contactsDiv.style.display = 'block';
                window.framework.populateContacts(search.results(), contactsDiv);
                window.framework.createContactCard(search.results()[0].result, <HTMLElement>content.querySelector('.contactcard'));
                window.framework.updateNotification('success', 'Contact Found');
            } else {
                window.framework.updateNotification('error', 'Contact not found. Please check the spelling or try a different search.');
            }
        }, error => {
            window.framework.updateNotification('error', error);
        });
    });
})();
