# Reusing UCWA FQDN across signins

The caller can get the rel=applications FQDN
after sign-in is completed:

```js
app.signInManager.signIn({
  id: "123...",
  client_id: "...",
  origins: [
    "webdir.online.lync.com",
    ...
  ]
}).then(() => {
  var fqdn = app.ucwa.fqdn; // store it somewhere
});
```

Next time this FQDN can be added to the `origins` list
to make the auto-d faster (about 2x faster):

```js
app.signInManager.signIn({
  id: "123...",
  client_id: "...",
  origins: [
    "webdir.online.lync.com",
    fqdn, // e.g. "webpoolbn10m03.infra.lync.com"
    ...
  ]
});
```

The idea is that the app can store this FQDN on its server
and reuse on different machines that belong to the same
user to make the auto-d faster.

If the FQDN is wrong, e.g. the user has been moved to another
pool, the auto-d will still work because there are other entires
in the `origins` list: it'll just take longer to sign-in.
