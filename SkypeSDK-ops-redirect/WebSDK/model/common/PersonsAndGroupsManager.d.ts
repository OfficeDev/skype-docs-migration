/// <reference path="Person.d.ts" />
/// <reference path="Group.d.ts" />
/// <reference path="SearchQuery.d.ts" />

declare module jCafe {

    /**
     * It holds a root group, which contains the list of all clients and groups 
     * known to the client.
     */
    export interface PersonsAndGroupsManager {

        /** 
         * Represents signed in user.
         * Here is a correct way to display the availability state of the user:
         *
         *     client.signInManager.state.when("SignedIn", () => {
         *         var tag = $("<span>").appendTo($("body"));
         *         var pgm = client.personsAndGroupsManager;
         *         pgm.mePerson.status.subscribe();
         *         pgm.mePerson.status.changed((status) => {
         *             tag.text(status);
         *         });
         *     });
         */
        mePerson: MePerson;

        /**
         * The root group contains a list of all contacts and groups.
         *
         * This is the root group contains 'persons' as  a collection  of all 
         * contacts, and 'groups' as a collection of all groups (user-created 
         * groups, server created groups and relationship groups).
         */
        all: Group;

        /**
         * Creates a search query for
         * searching persons. The search results will be provided
         * after the request of searching query is resolved by server.
         *
         * var searchQuery = client.personsAndGroupsManager.createPersonSearchQuery();
         * searchQuery.text("John");
         * searchQuery.limit(10);
         * searchQuery.getMore().then(() => {
         *     if (searchQuery.getMore.enabled())
         *         console.log("More results are available on the server");
         *     else
         *         console.log("No more results are available on the server");
         *
         *     searchQuery.results().forEach((r) => {
         *         console.log("person:", r.result.name());
         *     });
         * });
         */
        createPersonSearchQuery(): SearchQuery<Person>;

       /**
        * Creates a search query for
        * searching groups. The search results will be provided
        * after the request of searching query is resolved by server.
        *
        * var searchQuery = client.personsAndGroupsManager.createPersonSearchQuery();
        * searchQuery.text("FooGroup");
        * searchQuery.limit(10);
        * searchQuery.getMore().then(() => {
        *     if (searchQuery.getMore.enabled())
        *         console.log("More results are available on the server");
        *     else
        *         console.log("No more results are available on the server");
        *
        *     searchQuery.results().forEach((r) => {
        *         console.log("group:", r.result.name());
        *     });
        * });
        */
        createGroupSearchQuery(): SearchQuery<Group>;

        /** 
         * Creates a group which can be then added to another group.
         *
         * The created group must be given a unique name first:
         * 
         *  var g = pgm.createGroup();
         *  g.name("ABC");
         *  pgm.all.groups.add(g); 
         */
        createGroup(): Group;
    }
}