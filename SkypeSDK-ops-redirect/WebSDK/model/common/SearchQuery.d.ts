/// <reference path="pm.d.ts" />

declare module jCafe {
    export type Scope = string;
    
    export interface SearchResult<T> {
        result: T;
    }

    /**
     * Represents a search query that may combine standalone search terms with 
     * key-value pairs defining search for items with given property values.
     *
     * We don't want to build an elaborate query language, so we default to 
     * CONTAINS and OR.
     * Example: Searching Persons for "Jos" may return both a Person named 
     * "Jay Osbourne" with id "josbourne" and a Person named "Joseph Smith" 
     * while searching for "jos" would return "Joseph Smith" only. 
     */
    export interface SearchQuery<T> {

        /** search terms in the search query
            Example: "Joe" returns "Joe Smith" */
        text: Property<string>;

        /** Max number of results to be fetched by one getMore call */
        limit: Property<number>;

        /** Observable collection of results appended by each getMore call */
        results: Collection<SearchResult<T>>;

        /** 
         * Indicates whether more results are available on the server.
         *
         * The fact that more results are available doesn't necessarily mean that
         * these additional results can be obtained as the server may not support
         * getting these additional results. However if it's possible to get these
         * results, GetMore will be enabled and will be able to pull them. 
         */
        moreResultsAvailable: Property<boolean>;

        /** 
         * The search method.
         *
         * Always enabled for the first invocation. For subsequent calls is 
         * enabled if the previous getMore call indicated that there are more 
         * results available and can be obtained. In some cases, however, 
         * additional results may be available on the server but not obtainable
         * as the server doesn't offer API to get them. 
         */
        getMore: Command<() => Promise<void>>;
    }
}
