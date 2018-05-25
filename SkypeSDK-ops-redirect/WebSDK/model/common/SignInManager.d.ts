/// <reference path="pm.d.ts" />

declare module jCafe {

    /**
     *       "SignedOut"
     *       "SigningIn"
     *       "SignedIn"
     *       "SigningOut"
     */
    export type LoginState = string;
    
    export interface SignInManager {
        /**
         * The following code can be used to invoke a particular function whenever
         * the client signs in:
         *
         *     client.signInManager.state.when("SignedIn", () => {
         *         console.log("The client has signed in");
         *     });
         *
         * To determine the reason of being signed out, check Property#reason:
         *
         *     client.signInManager.state.when("SignedOut", reason => {
         *         console.log("Client signed out because " + reason);
         *         console.log("Client signed out because " + sm.state.reason);
         *     });
         *
         * Typically state.reason.code = "ConnectionLost" which indicates
         * that the client has lost the event channel connection with UCWA.
         */
        state: Property<LoginState>;

        /**
         * Signs in a user with given credentials.
         *
         * To sign in via the basic auth, specify the user name and password in 
         * plain text:
         *
         *     sm.signIn({
         *         username: 'user1@company.com',
         *         password: 'password1'
         *     }).then(() => {
         *         console.log('Signed in as ' + 
         *              client.personsAndGroupsManager.mePerson.name());
         *     });
         *
         * To sign in via IWA and make the browser show a credentials popup 
         * specify the domain FQDN:
         *
         *     sm.signIn({
         *         domain: 'company.com'
         *     }).then(() => {
         *         console.log('Signed in as ' + 
         *              client.personsAndGroupsManager.mePerson.name());
         *     });
         *
         * To join an online meeting anonymously specify the meeting URI:
         *
         *     sm.signIn({
         *         meeting: "sip:user5@contoso.com;gruu;opaque=app:conf:focus:id:QHJ72TKK"
         *     }).then(() => {
         *         console.log("Signed in as " + 
         *              client.personsAndGroupsManager.mePerson.uri());
         *     });
         *
         * To sign in via the implicit OAuth2 flow specify the client_id:
         *
         *     sm.signIn({
         *         client_id: '123-456',
         *         oauth_uri: 'https://login.windows-ppe.net/common/oauth2/authorize',
         *         cors: true,
         *         redirect_uri: '/an/empty/page.html',
         *         origins: [
         *             'https://webdir.tip.lync.com/AutoDiscover/AutoDiscoverservice.svc/root?originalDomain=contoso.com',
         *             'https://webdir.online.lync.com/AutoDiscover/AutoDiscoverservice.svc/root?originalDomain=contoso.com',
         *         ]
         *     });
         *
         * To connect to an existing app's event channel, specify id of that app:
         *
         *     sm.signIn({
         *         username: "user1@company.com",
         *         password: "password1",
         *         id: "273867-234235-45346345634-345"
         *     });
         * 
         * To sign in to Skype for Business Online using OAuth while handling the logic of retrieving OAuth tokens yourself:
         * 
         *      sm.signIn({
         *          client_id: '123-456',
         *          origins: [ 'https://webdir.online.lync.com/AutoDiscover/AutoDiscoverservice.svc/root' ],
         *          cors: true,
         *          get_oauth_token: function(resource) {
         *              // Return a valid unexpired token for the specified resource if you already have one. 
         *              // Else, return a promise and resolve it once you have obtained a token.
         *              return 'Bearer eyJ0e...';
         *          }
         *      });
         */
        signIn: Command<(options) => Promise<void>>;

        /**
         * Signs out by deleting the application resource.
         * Cancels the sign in operation if it's pending.
         *
         *      client.signOut().then(() => {
         *          console.log('Signed out');
         *      });
         */
        signOut: Command<() => Promise<void>>;
    }
}