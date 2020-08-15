# alt:V - Database Wrapper with Type ORM

---

Remember to 🌟 this Github if you 💖 it.

---

**IMPORTANT:**

Make sure you have package.json in your main directory.
You can do this by doing `npm init`

### Installation

Move files / folders accordingly.
Also ensure the folder names are correct.
Your folder structure should be similar to this.

```javascript
resources/
└── postgres-wrapper/
    ├── client.mjs
    ├── database.mjs
    ├── config.json
    └── resource.cfg
└── yourResource/
    ├── server/
    |   └── server.mjs
    ├── entities/
    |   └── entities.mjs
    ├── client/
    └── resource.cfg
```

If you haven't setup a package.json yet; please do so.

```javascript
npm init
```

After setting up your project structure you need to install two npm packages.

```javascript
npm install --save mysql
npm install --save typeorm
npm install --save pg
```

### Establishing a Database Connection
You need to establish a connection the the main database.js file, you can do this by scrolling to the bottom of the file and editing the following. The `Entity Export Name` must match the name that is imported at the top of the file so if you have `Account` imported from your entities file at the top of the database file, then you need to have `Account` in `ConnectionInfo` array

```
dbType, dbHost, dbPort, dbUsername, dbPassword, dbName, entityArray
```

```js
export default new ConnectionInfo('mysql', '127.0.0.1', 3306, 'root', '', 'economy', [
    Account,
]);
```

### Example Usage

You'll need to adjust your import according to your resource setup.

**Example entities.mjs**

```javascript
import orm from 'typeorm';

export const Account = new orm.EntitySchema({
    name: 'Account',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        username: {
            type: 'varchar'
        },
        password: {
            type: 'varchar'
        }
    }
});

```

**Example Database Usage for Postgres**
You need to establish a connection the the main database.js file, you can do this by scrolling to the bottom of the file and editing the following:@

```javascript
import * as alt from 'alt';
import db from 'PATH TO DATABASE.js';

// This is an event called when the database is connected.
// You don't need to use this; but it helps understand the current state of the db connection.
alt.on('ConnectionComplete', () => {
    const accountDocument = {
        username: 'stuyk',
        password: '123'
    };
    
    async function handleLogin(player, username, password) {
    
        // Fetch all data by field
        // (field name, field value, repo name)
        const usernames = await db.fetchAllByField('username', username, 'Account');
        if (usernames.length >= 1) {
            alt.emitClient(player, 'register:SetError', `Username is already in use.`);
            return;
        }


        // Insert a Document to Database
        // (field value, repo name)
        const accountData = await db.insertData(accountDocument, 'Account');
        if (!accountData) {
            console.log("There was an error sending information to the datavase")
            return;
        }
    }
    
    

});
```
