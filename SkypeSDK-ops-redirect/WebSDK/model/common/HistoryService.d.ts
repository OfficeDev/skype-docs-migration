/// <reference path="ActivityItems.d.ts" />

declare module jCafe {
    
    export interface HistoryService {
        /** Includes messages and activity items of other types that 
         * should be ignored. 
         */
        activityItems: Collection<ConversationActivityItem>;
    }
}