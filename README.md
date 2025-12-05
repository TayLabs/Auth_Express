# @auth/express

SDK for use in Express applications that use the TayLabs/Auth service

## authenticate middleware

The `authenticate` middleware is used to parse the access token from the incoming request and validate it based on the JWT's secret

```typescript
app.use(authenticate);
```

## authorize middleware

The `authorize` middleware is used to parse the access token from the incoming request and validate it based on the JWT's secret

```typescript
app.use(authorize('user.read'));
```
