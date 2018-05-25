/// <reference path="pm.d.ts" />
/// <reference path="DevicesManager.d.ts" />
/// <reference path="SignInManager.d.ts" />
/// <reference path="ConversationsManager.d.ts" />
/// <reference path="PersonsAndGroupsManager.d.ts" />

declare module jCafe {
    /**
     * The root object in the object model.
     *
     * One instance of Application creates one UCWA endpoint that
     * can sign in with its own credentials. The constructor
     * is not a singleton as it is possible to create several
     * UCWA endpoints in one web app and make them chat with
     * each other via the UCWA protocol.
     */
    export interface Application {
        
        personsAndGroupsManager: PersonsAndGroupsManager;
        conversationsManager: ConversationsManager;
        devicesManager: DevicesManager;
        signInManager: SignInManager;
    }
}