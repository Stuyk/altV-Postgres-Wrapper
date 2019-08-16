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

```javascript
import * as alt from 'alt';
import SQL from '../../postgres-wrapper/database.mjs';
import { Account } from './entities/entities.mjs';

// Each Database Schema you create will need to be added to the array after your connection string.
// The database connection string goes as follows for postgres
// postgresql://username:password@localhost:5423/databaseName
const dbType = 'postgres';
const dbHost = 'localhost';
const dbPort = '5423';
const dbUsername = 'postgres';
const dbPassword = 'abc123';
const dbName = 'altv';

// Must be in this specific order.
// dbType, dbHost, dbPort, dbUsername, dbPassword, dbName, entityArray
var database = new SQL(dbType, dbHost, dbPort, dbUsername, dbPassword, dbName, [
    Account
]);

// This is an event called when the database is connected.
// You don't need to use this; but it helps understand the current state of the db connection.
alt.on('ConnectionComplete', () => {
    var Account = {
        username: 'stuyk',
        password: '123'
    };

    // Update or Insert a new document.
    database.upsertData(Account, 'Account', result => {
        // Fetch data by field name, field value, and repo name.
        database.fetchData('username', 'stuyk', 'Account', res => {
            if (res === undefined) {
                console.log('This user was not found.');
                return;
            }

            console.log(res);
        });

        // Fetch a document by ID.
        database.fetchByIds(1, 'Account', res => {
            if (res === undefined) {
                console.log('The document with the id was not found.');
                return;
            }

            console.log('Fetched Document for ID: ' + res[0].id);
            console.log(res[0]);

            // The result is going to be an array if it finds the document.
            // If you're expecting 1 result. Then use call [0] on res.
            console.log('Attempting to Update Data...');
            database.updatePartialData(
                res[0].id,
                { username: 'NewUsername' },
                'Account',
                res => {
                    // Will return an object if successfull.
                    if (typeof res !== 'object') {
                        console.log('Failed to find and update document.');
                        return;
                    }

                    console.log('Updated Successfully');
                }
            );
        });

        // Returns an array of all documents with all data.
        // If no documents exist; it'll be undefined.
        database.fetchAllData('Account', res => {
            console.log('Fetched all documents for table ACCOUNT');
            console.log(res);
        });

        // Selects all data and returns just usernames.
        database.selectData('Account', ['username'], res => {
            console.log('Selected by USERNAME');
            console.log(res);
        });

        // Delete by ID
        setTimeout(() => {
            database.deleteByIds(1, 'Account', res => {
                console.log('Deleted ID 1');
                console.log(res);
            });
        }, 5000);
    });
});
```
