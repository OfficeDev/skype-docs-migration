declare module jCafe {
    export interface Property<T> {
        /** 
         * Reads the cached value from the property.
         * The local cached value may differ from the
         * corresponding value on the server. 
         */
        (): T;

        /** 
         * Changes the value of the property.
         * If the property is linked to a value on the server,
         * this sends a requets to the server; however to track
         * the progress of the operation, use .set(...). 
         */
        (value: T, reason?: any): any;

        /** Fetches the actual value from the server. */
        get: Command<() => Promise<T>>;

        /** Requests to change the value and returns a promise
            that gets resolved after the value is changed. */
        set: Command<(value: T, reason?) => Promise<void>>;

        /** 
         * Tells the property to keep its value up to date.
         * This may result in creating a subscription on the server.
         * If the value of the property is needed only once, it's
         * preferrable to use .get(). 
         */
        subscribe(): { dispose: () => void };

        /** Creates a property with customized .set method.
            The set function can be passed as a command. */
        fork(set: (value: T, reason?) => Promise<T> | T): Property<T>;

        /** 
         * Creates a property which value is derived from this property's value.
         * The following is true at all times:
         * 
         *  p.map(fn)() == fn(p());
         * 
         * The created property is read only and changes after the origin property. 
         */
        map<U>(fn: (value: T) => U): Property<U>;

        /** 
         * Same as adding a listener to the .changed event with an if
         * condition inside:
         * 
         *  p.changed((newValue, reason, oldValue) => {
         *      if (newValue == 3) {
         *          ...
         *      }
         *  }); 
         */
        when(value: T | ((value: T) => boolean),
            fn: (reason: any, oldValue: T) => void): { dispose: () => void };

        /** 
         * Same as adding a listener to the .changed event that removes
         * itself once the needed event appears:
         * 
         *  p.changed(function listener(newValue, reason, oldValue) {
         *      if (newValue == 3) {
         *          p.changed.off(listener);
         *          ...
         *      }
         *  }); 
         */
        once(value: T | ((value: T) => boolean),
            fn: (reason: any, oldValue: T) => void): { dispose: () => void };

        /** This event is fired whenever the property's value gets changed.
            The parameters are (new value, reason, old value). */
        changed: Event<(newValue: T, reason, oldValue: T) => void>;

        /** The reason why the property has this value.
            It can be changed by the .set(...) function. */
        reason: any;
    }

    export interface Collection<T> {
        /** 
         * Gets all items of the collection as an array.
         * The items cached in the collection may differ
         * from items stored in the corresponding collection
         * on the server. 
         */
        (): T[];

        /** 
         * Gets an item by its numeric zero-based index or key.
         * The item's index may change after other items are
         * added or removed. The item's key never changes, even
         * after other items are added or removed. 
         */
        (index: number | string): T;

        /** The number of items in the collection as an observable property. */
        size: Property<number>;

        /** 
         * Fetches all items of the collection from the server or fetches
         * only one item by its index or key. Returns a promise that resolves
         * to the array of the items or the requested item. 
         */
        get: {
            (): Promise<T[]>;
            (key: string): Promise<T>;
            (index: number): Promise<T>;
        };

        /** Adds a new item to the collection.
         * Arguments are (item, key, index).
         * Returns a promise that resolves to the key of the added item. 
         */
        add: Command<(item: T, key?: string, index?: number) => Promise<string>>;

        /** Removes an item from the collection.
            Returns a promise that resolves after the item is removed. */
        remove: Command<(item: T) => Promise<void>>;

        /** 
         * Tells the collection to keep its data up to date.
         * This may result in creating a subscription on the server.
         * If the items of the collection are needed only once, it's
         * preferrable to use .get(). 
         */
        subscribe(): { dispose: () => void };

        /** Creates a collection with customized .add and .remove methods. */
        fork(add: any, remove: any): Collection<T>;

        /**
         * Creates a collection with items mapped with the given function:
         * The following is true at all times for any item:
         * 
         *  items.map(fn)(i) == fn(items(i));
         * 
         * The created collection is read only and changes after the origin 
         * collection. 
         */
        map<U>(fn: (item: T) => U): Collection<U>;

        /**
         * Creates a collection with some items removed.
         * The created collection is read only and changes after the origin 
         * collection. 
         */
        filter(predicate: (item: T) => boolean): Collection<T>;

        /** 
         * Created a collection with all items sorted.
         * The given function is a predicate which says whether the order of two given
         * items is correct; thus to do the basic sort use the following predicate:
         * 
         *  items.sort((x, y) => x < y);
         *  
         * The created collection is read only and changes after the origin collection. 
         */
        sort(order: (lhs: T, rhs: T) => boolean): Collection<T>;

        /**
         * Aggregates the items in the collection into an observable property.
         *
         * The key feature of this method is that it's like ko.computed observes
         * the list of dependent properties and updates the aggregated value
         * whenever any of the deps changes.
         *
         *      const values = Collection();
         *      const product = values.reduce((val, prop) => val ? val * prop() : 0, 1);
         *
         *      const x = Property(); x.set(3);
         *      const y = Property(); y.set(5);
         *      const z = Property(); z.set(7);
         *
         *      values.add(x); // product() == 3
         *      values.add(y); // product() == 3*5
         *      values.add(z); // product() == 3*5*7
         *
         *      y.set(0); // product() == 0 and z is not even being observed
         *      y.set(11); // product() == 3*11*7 and z is being observed again
         *
         * A possible application is computing the number of online users:
         *
         *      const nOnline = persons.reduce((n, p) => n + (!!p.status() == "Online"), 0);
         *      nOnline.changed(n => document.title = n + " people online");
         *
         * This works as long as the computed value doesn't depend on some external source.
         */
        reduce<U>(aggregate: (previous: U, current: T) => U, initialValue?: U): Property<U>;

        /** This event is fired immediately after an item gets added.
            The arguments are (item, key, index). */
        added: Event<(item: T, key: string, index: number) => void>;

        /** This event is fired immediately after an item gets removed.
            The arguments are (item, key, index). */
        removed: Event<(item: T, key: string, index: number) => void>;

        /** This event is fired immediately after an item is added or removed.
            The event doesn't have any arguments. */
        changed: Event<() => void>;
    }

    export interface Promise<T> {
        /** This method is described in the Promise/A+ spec. */
        then<U>(
            done?: (res: T) => Promise<U> | U,
            fail?: (err: any) => Promise<any> | any,
            info?: (status: any) => void): Promise<U>;

        catch<U>(fail?: (err: any) => Promise<U> | U): Promise<U>;
        finally(fn: () => void): Promise<T>;
    }

    /**
     * Command is a function that has an enabled property.
     */
    export type Command<Signature extends (...args) => any> = Signature & {
        bind(that, ...args): Command<(...args) => any>;
        enabled: Property<boolean>;
    }

    interface Event<Listener extends (...args) => void> {
        /** Adds a listener to the event. */
        (listener: Listener): { dispose: () => void };
        /** Removes a listener from the event. */
        off(listener: Listener): void;
    }
}
