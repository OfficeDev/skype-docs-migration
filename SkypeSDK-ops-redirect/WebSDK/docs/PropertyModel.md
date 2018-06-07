# Skype Web SDK property model


 _**Applies to:** Skype for Business 2015_

 **In this article**  
- [Model object](#model)
- [Observable properties](#property)
- [Observable collections](#collection)
- [Observable commands/methods](#command)  
- [Event object](#event)
- [Promise object](#promise)

### Model objects
<a name="model"></a>

These are plain JS objects that are called "model objects" because their members are of the four types:

- other model objects
- observable properties
- observable collections 
- observable commands

A model object can be wrapped by another model object in such a way that an observer won't be able to determine that there is a wrapper on top of the actual object. If model objects had plain properties, i.e. `model = { a: 123, b: "def" }`, this wouldn't be possible.

>The next revision of JS (aka ES6) has introduced the Proxy API that allows to achieve this behavior for any JS object, without applying restrictions on types of members/properties it can have. However the SDK is supposed to work in ES5 environments and thus cannot use features like Proxy.

### Observable properties
<a name="property"></a>

Every property in the SDK is represented by an observable property with this interface. For instance, if there is a `Person` object which has a `displayName` property, the property will be presented in the form of an observable property:

```js
person.displayName(); // reads the value
```

There are no plain properties in the SDK.

A property object is as simple as a value wrapped into a function that gives read/write access to the value. This is very similar to the "observables" concept in Knockout.

```js
function property(value) {
  return function (newValue) {
   if (arguments.length == 0)
    return value;
   
   value = new Value;
  };
}

p = property(123);
p(); // get value: 123
p(456); // set value
```

On top of this very simple idea the SDK adds numerous methods to deal with the property objects (this doesn't make the property objects heavier because all these methods are in the prototype object shared by all property objects). The most commonly used methods are:

- `p()` reads the current value. This call doesn't have any side effects and simply returns the current value.
- `p.get()` pulls the current value (usually from UCWA). If the property is simple, i.e. doesn't correspond to any entity on UCWA or somewhere else like `MePerson#status`, then `p.get()` returns a resolved promise object. However some properties correspond to some server state and thus their locally cached values may differ from actual values on the server.

  ```js
  p.get().then(res => {
    console.log("the value of p:", res);
  }, err => {
    console.log("couldnt pull the value of p:", err);
  });
  ```
  
  It's safe to invoke `p.get()` multiple times in a row: the SDK puts such requests to a queue and executes them at the next event turn.
  
  ```js
  // this sends just one GET /presence
  for (i = 0; i < 10; i++)
    app.personsAndGroupsManager.mePerson.status.get();
  ```

- `p(123)` sets a new value. In some property objects this will simply change the internal value without any side effects. However many properties in the SDK have customized setters. For instance, changing the `MePerson#status` property makes the SDK send a `POST` request to UCWA to change the user's online status. In those cases `p(123)` invokes the custom setter. If the app needs to observe the progress of the operation, it should use `p.set(123)` which is same as `p(123)` except that it returns a `Promise` object (and this is why it's a bit heavier: `p(123)` doesn't create that extra `Promise` object).

   ```js
   p.set(123).then(res => {
     console.log("the new value of p:", res); // res == p()
   }, err => {
     console.log("couldnt change the value of p:", err);
   });
   ```

- `p.subscribe()` tells that the app needs this property to keep its value up to date at all time, until the subscription is removed. This makes an effect only on properties that can be subscribed to, i.e. `MePerson#status`, while on other properties the `subscribe` call will do nothing. If a property can be subscribed to, then `p.subscribe()` will increment the internal subscriptions counter and if this is the first subscription, it will invoke the subscription procedure associated with that property: for `MePerson#status` that would be a `POST` request to UCWA, for `DevicesManager#cameras` that would be a WebRTC call and so on. A subscription can be released with the `dispose` method:

    ```js
    s = p.subscribe();
    setTimeout(() => s.dispose(), 3600 * 1000); // unsubscribe 1 hour later
    ```

  If a property is subscribed to, there is no need to poll its value with `p.get()` as the SDK does this for the app. A subscription is generally heavier than a one time fetch with `p.get()`, but lighter than frequent `get` calls.

- `p.subscribe(300)` starts a periodic polling with `p.get()`. In some cases the app needs to poll the property value from time to time, but doesn't want to create a subscription, as it's heavy. One approach would be to set a timer that would poll the value periodically:

    ```js
    setInterval(() => p.get(), 15 * 60 * 1000); // poll every 15 mins
    ```
  
  This works well as long as there is just one place in the app that manages this polling. However when the app becomes more complex, this approach no longer works. A typical situation is when the same `Person` object needs to be displayed by different view models in different places in the UI, that have different lifetime: one UI element is ok to poll the property once every hour, another needs more frequent polling, while the third one needs a subscription. In such cases the `p.subscribe(300)` method becomes useful: it keeps track on how many and which type of subscriptions it has and upgrades/downgrades them as appropriate.
  
    ```js
    s1 = p.subscribe(300); // poll every 300 seconds
    s2 = p.subscribe(50); // now poll every 50 seconds
    s3 = p.subscribe(); // stop polling and create a subscription
    s3.dispose(); // now continue polling every 50 seconds
    ```
    
  In this example the SDK first upgrades the polling to a subscription and then downgrades it back at the app request.

Every property object has a `changed` event, which is an instance of the `Event` object, and whenever the property value changes, it notifies observers via this event:

```js
p.changed(newValue => {
  console.log("the new value of p:", newValue);
});
```

If the property doesn't have a value, i.e. its value is `undefined`, then `p.changed(fn)` merely adds the `fn` listener. However if the property had a value, it invokes `fn` right away. This behavior allows to not write special handling for thw two cases: when the property has a value and when it doesn't.

A common use of such event listeners is doing something when the property gets a certain value.

```js
p.when(123, () => {
  console.log("the value has changed to 123");
});
```

If the callback needs to be invoked only once, use `Property#once`.

```js
p.once(123, () => {
  console.log("the value has changed to 123");
});
```

There are a few additional features of the property object that are mostly used inside the SDK, but can appear useful in a web app:

- `q = p.map(x => x * x)` creates a new property object which value changes after the value of the parent property. In addition to that calls like `q.get()` or `q.subscribe()` are properly redirected to the parent property.

### Observable collections
<a name="collection"></a>

Collections and properties have very similar interfaces and this is why a collection can be thought of as a property holding an array of values. Internally, a collection is a pair of arrays: one array with values, another array with keys. So on the one hand a collection is an array of items with a certain order, while on the other hand every item has a key associated with it and even if the item is relocated within the collection, it can still be found by its key.

- `persons()` returns an array of items in the collection. This call doesn't have any side effects and simply returns the internal array of items (a copy of that array). `persons(3)` returns an item at the given index: same as `persons()[3]`.

- `persons.get()` fetches the list of items, usually from UCWA. If the collection doesn't have a custom getter, then this `get` call returns a resolved promise. The returned promise is resolved with the array of items.

  ```js
  persons.get().then(ps => {
    console.log("the list of persons:", ps); // ps is same as persons() here
  });
  ```
  
  `persons.get(3)` does the same thing, but returns the item at the given index. The same result can be achieved with `persons.get().then(ps => ps[3])`.

- `persons.subscribe()` creates a subscription to the collection. This is no different from this method works in property objects, except that subscription to some collections is generally heavier.

- `persons.subscribe(300)` starts polling the collection with the given interval in seconds. This is no different how this works in properties.

- `persons.add(p)` adds a new item to the collection and returns a promise object to track the async operation. This works if the collection is writable.

- `persons.remove(p)` removes an item from the collection and returns a promise object to track the async operation. This works if the collection is writable.

Just like properties, collections have the `changed` event, but in addition to that they have `added` and `removed` events that notify the app when an item is added or removed. The `changed` event simply aggregates the `added` and `removed` events.

```js
persons.added((p, key) => {
  console.log("new person added:", key, p);
});

persons.removed((p, key) => {
  console.log("a person removed:", key, p);
});

persons.changed(() => {
  console.log("the updated list of items:", p());
});
```

If the collection had some items, then `persons.changed(fn)` invokes `fn` once right away and `persons.added(fn)` invokes `fn` once for every item in the collection. This allows to now write special handling for the two cases: when the collection is empty and when it has some items.

There are a few methods to derive new collections based on existing ones.

- `b = a.sort((lhs, rhs) => lhs.tag < rhs.tag)` creates a sorted read only collection. The new collection remains observable: it observes the parent collection and adds or removes items according to the given order. This is useful when the same collection needs to be displayed in one placed sorte by, say, display names, and in another placed sorted by online status:
  
  ```js
  // s1 is the list of persons sorted by display name
  s1 = persons.sort((p1, p2) => p1.displayName() < p2.displayName());
  
  // s2 is the list of persons sorted by online status
  s2 = persons.sort((p1, p2) => p1.status() < p2.status());
  ```

  Note the difference from `Array#sort`: the list of persons could be sorted with `persons().sort((p1, p2) => p1.displayName() < p2.displayName() ? -1 : 0)` but then the created sorted array would remain static and after the parent collection is changed, the array would remain the same.
  
- `b = a.filter(x => x.tag > 123)` creates a collection with items from the parent collection matching a certain predicate. The items appear in the same order.

  ```js
  // the new collection is observable, but contains messages only: no missed calls items and so on
  messages = conversation.historyService.activityItems.filter(x => x.type() == "TextMessage");
  ```
  
  In this example the `messages` collection is observing the parent `activityItems` collection, checks if newly added items match the predicate and adds them ifthey do.
  
- `b = a.map(x => x.tag)` creates a collection which takes all items from the parent collection and applies to the the given mapping function. Same idea as in `Array#map` except that the result remains connected with the parent collection.

### Observable commands/methods
<a name="command"></a>

In the SDK a command is simply a function with the `enabled` boolean property. When a command is invoked, it checks the value of the `enabled` property and throws an error if it's `false`. There are two uses of the `enabled` property:

- It can be observed and the UI can gray out a button associated with the command.
- `enabled.reason` tells why the command is disabled.

### Event object
<a name="event"></a>

The event object is simply an array of callbacks: the app can add or removed them and the SDK can "fire" the event to invoke the callbacks. In general, adding or removing event listeners doesn't have any side effects.

- `event.on(fn)` or just `event(fn)` adds an event listener.
- `event.off(fn)` removes the event listener. Another way to remove it is to use the `dispose` method.

The most common pattern is to use `on` and `off` methods with a named event listener:

```js
person.status.changed(fn);
persons.status.changed.off(fn);
```

Another pattern is to use the `dispose` method that allows to add anonymous callbacks:

```js
s = persons.status.changed(fn);
s.dispose();
```

The third pattern is to use anonymous named callbacks:

```js
persons.status.changed(function fn(status) {
  if (status == "Offline")
    persons.status.changed.off(fn);
    
  // do something else
});
```

This pattern is useful to add one time event listeners that remove themselves. The `dispose` pattern wouldn't work in all cases because the added callback may be invoked right away if the property `status` had a value.

### Promise object
<a name="promise"></a>

In the SDK some methods are return the result right away, while some are asynchronous: they return a `Promise` object that is eventually resolved with the result. The SDK adheres to the `Promise/A+` specification which is well documented elsewhere, so here only common patterns with promise objects are explained.

The most common use is to set a callback that's invoked once the async operation succeeds:

```js
person.status.get().then(() => {
  console.log("the status is:", person.status());
});
```

Error handler can be added as the second callback:

```js
person.status.get().then(res => {
  console.log("the status is:", res);
}, err => {
  console.log("something went wrong:", err);
});
```

The first callback can be omiited:

```js
person.status.get().then(null, err => {
  console.log("something went wrong:", err);
});
```

Since this is a very common pattern, the spec defines `Promise#catch` method for this purpose:

```js
person.status.get().catch(err => {
  console.log("something went wrong:", err);
});
```

Similarly, to do something after the operation completes - eitehr succeeds or fails - there is a method called `finally`, which is not in the `Promise/A+` spec yet:

```js
person.status.get().finally(() => {
  console.log("the .get() has succeeded or failed");
});
```

