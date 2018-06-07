/// <reference path="../../../framework.d.ts" />
declare var mui: any;
(function () {
    'use strict';
    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTHistoryConversation.md' : 'Content/websdk/docs/PTHistoryConversation.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    function cleanUI() {
    }

    function cleanupConversation() {
        if (conversation.state() !== 'Disconnected') {
            conversation.leave().then(() => {
                conversation = null;
            });
        } else {
            conversation = null;
        }
    }

    function reset(bySample: Boolean) {
        window.framework.hideNotificationBar();
        content.querySelector('.notification-bar').innerHTML = '<br/> <div class="mui--text-subhead"><b>Events Timeline</b></div> <br/>';

        // remove any outstanding event listeners
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].dispose();
        }
        listeners = [];

        if (conversation) {
            if (bySample) {
                cleanupConversation();
                cleanUI();
            } else {
                const result = window.confirm('Leaving this sample will end the conversation.  Do you really want to leave?');
                if (result) {
                    cleanupConversation();
                    cleanUI();
                }

                return result;
            }
        } else {
            cleanUI();
        }
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.get'), 'click', () => {
        const conversationsManager = window.framework.application.conversationsManager;
        window.framework.showNotificationBar();
        window.framework.addNotification('info', 'Fetching conversations...');
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        conversationsManager.getMoreConversations().then(() => {
            // console.log('done')
        });

        let i: number = 0;
        listeners.push(conversationsManager.conversations.added((conv: any) => {
            listeners.push(conv.participants.added(participant => {
                window.framework.addNotification('success', 'Fetched conversation ' + (i + 1));
                window.framework.convs[conv.id()] = { conv: conv, id: i };
                const div = (<HTMLElement>content.querySelector('#step2'));
                const conv1 = document.createElement('div');
                const getHistoryBtn = document.createElement('span');
                getHistoryBtn.innerHTML = '<button id="btn' + i + '" class="mui-btn mui-btn--raised mui-btn--primary" onclick="window.framework.invokeHistory(\'' + conv.id() + '\')">Get History</button>';
                const text = document.createElement('p');
                text.innerHTML = '<u> Conversation ' + (i+1) + ': ' + conv.participants(0).person.displayName() + '</u>';
                text.className = 'mui--text-title';
                const convHistory = document.createElement('div');
                convHistory.id = 'convHistory' + i; 
                const terminatorElement = document.createElement('span');
                terminatorElement.innerHTML = '<br/> <div class="mui-divider"></div> <br/>';
                i++;
                conv1.appendChild(text); conv1.appendChild(getHistoryBtn); conv1.appendChild(convHistory); conv1.appendChild(terminatorElement);
                div.appendChild(conv1);
                listeners.push(conv.historyService.activityItems
                    .filter(item => item.type() === "TextMessage")
                    .added((msg: any) => {
                        const btnId: string = '#btn' + window.framework.convs[conv.id()].id;
                        const convHistoryId: string = '#convHistory' + window.framework.convs[conv.id()].id;
                        const convHistoryElement: HTMLInputElement = <HTMLInputElement>content.querySelector(convHistoryId);
                        (<HTMLInputElement>content.querySelector(btnId)).style.visibility = 'hidden';
                        var rowDiv = document.createElement('div');
                        rowDiv.className = 'mui-row';
                        var colLeftDiv = document.createElement('div');
                        colLeftDiv.className = 'mui-col-md-2';
                        if (msg.direction() == 'Incoming') {
                            colLeftDiv.innerHTML = '<span class="fa fa-arrow-circle-right info-notification"></span>';
                        } else {
                            colLeftDiv.innerHTML = '<span class="fa fa-arrow-circle-left info-notification"></span>';
                        }
                        var colRightDiv = document.createElement('div');
                        colRightDiv.className = 'mui-col-md-6';
                        colRightDiv.style.wordWrap = 'break-word';
                        colRightDiv.innerHTML = msg.text();
                        var colTimeDiv = document.createElement('div');
                        colRightDiv.className = 'mui-col-md-4';
                        colTimeDiv.innerHTML = msg.timestamp().toLocaleString();
                        rowDiv.appendChild(colLeftDiv);
                        rowDiv.appendChild(colRightDiv);
                        rowDiv.appendChild(colTimeDiv);
                        convHistoryElement.appendChild(rowDiv);
                    }));
            }));
        }));
        (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
    });

    window.framework.addEventListener(content.querySelector('.restart'), 'click', () => {
        (<HTMLElement>content.querySelector('#step1')).style.display = 'block';
        (<HTMLElement>content.querySelector('#step2')).innerHTML = '';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
        window.framework.hideNotificationBar();
        content.querySelector('.notification-bar').innerHTML = '<br/> <div class="mui--text-subhead"><b>Events Timeline</b></div> <br/>';
        window.framework.convs = {};
    });
})();
