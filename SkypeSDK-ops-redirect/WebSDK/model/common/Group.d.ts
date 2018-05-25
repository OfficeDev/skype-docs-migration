declare module jCafe {

    /** Group represents a few different group types.
     *
     *       "Root"                  // Contains the list of all persons and groups.
     *       "Custom"                // A user-created group with a custom name.
     *       "Others"                // Persons that do not belong to custom groups.
     *       "Favorites"             // Frequently contacted persons.
     *       "Distribution"          // Created by admins of the organization 
     *                                  and contain persons and other DGs.
     *       "PrivacyRelationship"   // One of five privacy relationship groups.
     */
    export type GroupType = string;

    /**
     * A group that holds a collection of contacts and nested groups.
     *
     * An instance of Group represents a group of contacts, which
     * can come from one of many sources:
     *
     *      -   the contact list that includes all contacts
     *      -   a distribution group
     *      -   a relationship group like Colleagues, Workgroup, Blocked
     *      -   a user-created or a server-created group of contacts
     *
     * These sources are similar in a sense that they encapsulate a contact list,
     * but the access path to that list may differ:
     *
     *     -    myContacts / contact[i]
     *     -    myPrivacyRelationship / contact[i]
     *     -    distributionGroup / contact[i]
     *     -    pinnedGroup / groupContacts / contact[i]
     *     -    defaultGroup / groupContacts / contact[i]
     *     -    group / groupContacts / contact[i]
     *
     * For instance to get the list of rel=contact resources for a rel=group,
     * the model at first gets rel=group, then it finds rel=groupContacts link
     * in it, sends a GET to that link and finds rel=contact links in the response.
     * To get the list of contacts for rel=myContacts and rel=myPrivacyRelationship
     * it's enough to send a GET to these resources; in case of rel=distributionGroup
     * the model sends a GET to distributionGroup/expandDistributionGroup.
     */
    export interface Group {
        type: Property<GroupType>;

        /**
         * This property is defined for user-created, server-created and 
         * distribution groups.
         *
         * There are two predefined groups created by the server, with the 
         * following names:
         *        - Other Contacts
         *        - Pinned Contacts
         *          ("Pinned Contacts" corresponds to the "Favorites" group.)
         *
         * The setter of the name attribute can be used to rename the group, which
         * leads to a "PUT" request being sent to UCWA. This "PUT" request, upon
         * success (with a 204 response), results in a new group being created by
         * UCWA (indicated by a "group added" event) with the new name, and the
         * old group (with the old name) being deleted by UCWA (indicated by a
         * "group deleted" event). For this reason, such a setter call will
         * return the (old) name of the old group, since the caller would still
         * hold the reference to the old group object (which will be deleted when
         * the "group deleted" event arrives).
         *
         * Consider this example to rename a group:
         *
         *     // assume getGroupByName returns the Group object by its name
         *     var group = getGroupByName("oldName");
         *
         *     client.personsAndGroupsManager.all.groups.added(() => {
         *         g.name.get().then((a) => {
         *             // the new group with the new name has been created
         *             // update the reference if want to reuse it
         *             if (a == "newGroup") group = g;
         *         });
         *     });
         *
         *     client.personsAndGroupsManager.all.groups.removed((g) => {
         *         g.name.get().then((a) => {
         *             // the old group with the old name has been deleted
         *             // the old reference is no long valid if not updated yet
         *             // so renew it to point to the new group object
         *             if (a == "oldGroup") group = getGroupByName("newName");
         *         });
         *     });
         *
         *     group.name.set("newName").then((a) => {
         *         // a should be the name "oldName" of the old group
         *         console.log(a);
         *     });
         *
         *     // at this moment, the group reference is likely still pointing
         *     // to the old group, with name "oldName"
         *     console.log(group.name());
         *     // ...
         *     // some moments later, after the "group added" event is received
         *     // the group reference has been updated to point to the new group
         *     // with name "newName"
         *     console.log(group.name());
         */
        name: Property<string>;

        /** Distribution groups have this id. This id looks like "sales@contoso.com" */
        uri: Property<string>;

        /**
         * All the contacts in this group.
         *
         * The constructor does not populate this collection
         * because the UI may not need to display the contacts
         * immediately. Instead it waits until someone subscribes to the
         * collection and then loads contacts from the server.
         *
         * When writing UI controls on top of this class, consider
         * the following approach of reading contacts:
         *
         *     group.persons.added((person) =>{
         *         person.displayName.changed((displayName) =>{
         *             $('.displayName').text(...);
         *         });
         *     });
         *
         * The handler attached to the "added" event will be invoked for
         * all contacts in the collection even if they were added to it
         * before the handler is attached.
         *
         * To get the list of contacts once from the server use the async `get`
         * method that sends a GET request(s) to the server and resolves the
         * returned promise to the array of Person models. In addition to
         * that it saves the list of Person models in the cache, so next
         * time these contacts can be retrieved without the need to go to the server.
         *
         *     group.persons.get().then((persons) => {
         *         persons.forEach((person) => {
         *             console.log(group.name() + " contains " + person.displayName());
         *         });
         *     });
         *
         * To add or remove a contact use the async add/remove methods:
         *
         *     group.persons.add(person).then(null, (err) => {
         *         console.log("The contact cannot be added: " + err);
         *     });
         *
         *     group.persons.remove(person).then(null, (err) => {
         *         console.log("The contact cannot be removed: " + err);
         *     });
         *
         * These methods send a request to the server to add or remove a contact.
         * The contact gets actually removed or added after the server sends a
         * corresponding event that can be observed in the `added` and `removed`
         * events of the collection.
         *
         * Not all groups support adding and removing contacts. For instance
         * distribution groups discovered via search cannot be edited this way.
         */
        persons: Collection<Person>;

        /**
         * Nested groups.
         *
         * A distribution group may have nested distribution groups.
         * This collection may initially be empty, as the UI may not need
         * to display the nested groups, but can be loaded from the server
         * either via a call to `groups.get` or via a subscription to
         * the `groups:added` event.
         *
         * To get the list of names of nested groups without
         * sending requests to the server:
         *
         *     var nestedGroups = thisGroup.groups();
         *     nestedGroups.forEach((group) => {
         *         console.log(group.name());
         *     });
         *
         * To request the list of nested groups from the server:
         *
         *     thisGroup.groups.get().then((nestedGroups) => {
         *         // now these groups in the local cache, so
         *         // nestedGroups == thisGroup.groups()
         *
         *         nestedGroups.forEach((group) => {
         *             console.log(group.name());
         *         });
         *     });
         *
         * To observe the collection of nested groups:
         *
         *     thisGroup.groups.added((group) => {
         *         console.log(group.name() + " has been added");
         *     });
         *
         *     thisGroup.groups.removed((group) => {
         *         console.log(group.name() + " has been removed");
         *     });
         */
        groups: Collection<Group>;
    }
}