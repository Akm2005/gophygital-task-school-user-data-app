# Classroom — School user directory

A responsive React demo with email/password sign-in, an administrator student directory, and an individual student profile.

## Run locally

```sh
npm install
npm run dev
```

## Demo sign-ins

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Admin123!` |
| Student | `alice@example.com` | `Student123!` |
| Student | `lukas@example.com` | `Student456!` |

Other seeded students use one of the student passwords above. User records are in `src/data/users.json`.

## Password note

The demo stores SHA-256 password hashes and checks them in the browser with the Web Crypto API. This demonstrates hashed-password verification for a static front-end exercise; a production application should authenticate on a server and use a password-hashing algorithm designed for credentials, such as Argon2id or bcrypt. A client-side JSON file is public and is not a secure user store.
