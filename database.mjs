import * as alt from 'alt';
import pg from 'pg';
import orm from 'typeorm';

// Example Connection String
//url: 'postgresql://postgres:abc123@localhost:5432/altv',
// Example entities to pass to the connection info
/*
	entities: [
		accSchema
	]
*/

// Singleton Connection Info
export default class ConnectionInfo {
    constructor(connectionString, entityArray) {
        if (!connectionString || !Array.isArray(entityArray)) {
            console.error(
                `!===> Error - connectionString or entityArray is not an array of EntitySchema.`
            );
            return;
        }

        // If instance does not exist.
        if (!ConnectionInfo.instance) {
            console.log(`@===> Starting Database Connection`);
            // Configuration Template
            this.config = {
                type: 'postgres',
                synchronize: true,
                url: connectionString,
                entities: entityArray
            };

            orm.createConnection(this.config)
                .then(conn => {
                    this.connection = conn;
                    ConnectionInfo.instance = this;
                    console.log('@===> Database is connected.');
                    Object.freeze(ConnectionInfo.instance);
                    alt.emit('ConnectionComplete');
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        }

        return ConnectionInfo.instance;
    }

    /**
     * Look up a document by the fieldName and fieldValue in a repo by name.
     * @param fieldName String of the field name.
     * @param fieldValue String of the field value.
     * @param repoName ie. "Account"
     * @param callback undefined | document
     */
    fetchData(fieldName, fieldValue, repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        repo.findOne({ where: { [fieldName]: fieldValue } })
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id.
     */
    upsertData(document, repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        repo.save(document)
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Update partial data for a document; based on object data based.
     * @param id ID of Document
     * @param partialObjectData Object
     * @param repoName The name of the table.
     * @param callback Result is undefined | object if updated
     */
    updatePartialData(id, partialObjectData, repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        repo.findByIds([id])
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                // Results after this.

                repo.update(id, partialObjectData)
                    .then(res => {
                        return callback(res);
                    })
                    .catch(err => {
                        console.err(err);
                        return callback(undefined);
                    });
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Fetch documents by ID or IDs.
     * @param ids
     * @param repoName The name of the table.
     * @param callback Returns undefined | Array<documents>
     */
    fetchByIds(ids, repoName, callback) {
        const repo = this.connection.getRepository(repoName);
        let idRef = ids;

        if (!Array.isArray(ids)) {
            idRef = [ids];
        }

        repo.findByIds(idRef)
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Delete documents from the database by ID.
     * @param ids Can be array or single id.
     * @param repoName The name of the table.
     * @param callback
     */
    deleteByIds(ids, repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        let idRef = ids;

        if (!Array.isArray(ids)) {
            idRef = [ids];
        }

        repo.delete(idRef)
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                return callback(undefined);
            });
    }

    /**
     * Fetch all documents by repo name.
     * @param repoName The name of the table.
     * @param callback returns undefined | array of results
     */
    fetchAllData(repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        repo.find()
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                return callback(res);
            })
            .catch(err => {
                return callback(undefined);
            });
    }

    /**
     * Select a table by fieldNames that apply.
     * @param repoName
     * @param fieldNamesArray
     * @param callback Returns undefined | Array of documents
     */
    selectData(repoName, fieldNamesArray, callback) {
        const repo = this.connection.getRepository(repoName);

        let selectionRef = fieldNamesArray;

        if (!Array.isArray(fieldNamesArray)) {
            selectionRef = [selectionRef];
        }

        repo.find({ select: selectionRef })
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }
}
