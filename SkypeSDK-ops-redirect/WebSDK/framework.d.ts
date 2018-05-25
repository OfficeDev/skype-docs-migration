/// <reference path="model/s4b.sdk/Application.d.ts" />

declare const config: {
    version: string;
    /** Skype.initialize */
    apiKey: string;
    /** SDK + the conversation control */
    apiKeyCC: string;
};

interface RenderConversationArgs {
    participants: string[];
    modalities: string[];
}

interface API {
    application: { new (args?): jCafe.Application };
    UIApplicationInstance: jCafe.Application;
    renderConversation(container: string | HTMLElement, args: RenderConversationArgs): jCafe.Promise<jCafe.Conversation>;
}

interface status {
    success: string,
    error: string,
    info: string,
    reset: string
}

interface auth {
    access_token: string,
    expires_in: string,
    session_state: string,
    token_type: string
}

interface Framework {
    api : API,
    application: jCafe.Application,
    auth: auth,
    addEventListener: (element: Element, event: string, callback: Function) => void,
    removeEventListener: (element: Element, event: string, callback: Function) => void,
    bindInputToEnter: (element: HTMLInputElement) => void,
    findContentDiv: () => HTMLElement,
    getContentLocation: () => string,
    status: status,
    reportStatus: (status: string, type: string, callback?: Function) => void,
    reportError: (error: Error|string, callback?: Function) => void,
    registerNavigation: (callback: Function) => void,
    navigationCallback: any,
    populateContacts: (contacts: jCafe.Person[]|jCafe.SearchResult<jCafe.Person>[], container: HTMLElement) => void,
    populateGroups: (groups: jCafe.Group[]|jCafe.SearchResult<jCafe.Group>[], container: HTMLElement) => void,
    addDetail: (container: HTMLElement, value: string, valueClass: string, header?: string) => void,
    addMessage: (item: string, container: HTMLElement) => void,
    createVideoContainer: (container: HTMLElement, size: string, person: jCafe.Participant) => HTMLElement,
    addContactCardDetail: (header, value, container) => void,
    createContactCard: (contact, container) => void,
    addNotification: (iconType, text) => void,
    updateNotification: (iconType, text) => void,
    showNotificationBar: () => void,
    hideNotificationBar: () => void,
    acceptIncomingChat: () => void,
    rejectIncomingChat: () => void,
    popupResponse: string,
    processingStatus: string,
    showModal: (modalText: string) => void,
    updateAuthenticationList: () => void,
    invokeHistory: (convId: number) => void,
    convs: any;
    updateUserIdInput: (userId: string) => string,
    updateUserIdOutput: (userId: string) => string,
    utils: { guid: () => string }
}

interface Window {
    framework: Framework;
}

declare const Skype: {
    initialize(
        args: { apiKey: string },
        onSuccess: (api: API) => void,
        onFailure?: (err) => void): any;
};
