declare module jCafe {

    /**
     *  The relationship level for privacy relationship groups.
     *  The privacy relationship groups are created by server and typically
     *  there are five such groups. In certain cases, however, these groups
     *  do not exist. 
     *
     *       "None"                  // Non privacy relationship groups have 
     *                                  this value for RelationshipLevel.
     *       "Blocked"
     *       "Colleagues"
     *       "Workgroup"
     *       "External"
     *       "FriendsAndFamily"
     */
    export type GroupPrivacyRelationshipLevel = string;

    export interface Group {
        /** Relationship groups do not have this id. All other groups do. */
        id: Property<string>;

        /** Privacy relationship groups have the relationship level. */
        relationshipLevel: Property<GroupPrivacyRelationshipLevel>;
    }
}