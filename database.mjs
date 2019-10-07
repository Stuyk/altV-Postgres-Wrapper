import * as alt from 'alt';
import orm from 'typeorm';

var currentConnection;

// Singleton Connection Info
export default class ConnectionInfo {
    constructor(
        dbType,
        dbHost,
        dbPort,
        dbUsername,
        dbPassword,
        dbName,
        entityArray
    ) {
        // If instance does not exist.
        if (currentConnection === undefined) {
            // Configuration Template
            const config = {
                type: `${dbType}`,
                host: `${dbHost}`,
                port: dbPort,
                username: `${dbUsername}`,
                password: `${dbPassword}`,
                database: `${dbName}`,
                entities: entityArray,
                cache: true
            };

            console.log(`---> Starting Database Connection`);
            orm.createConnection(config)
                .then(conn => {
                    this.connection = conn;
                    conn.synchronize().then(res => {
                        currentConnection = this;
                        console.log('---> Database Connected Successfully');
                        alt.emit('ConnectionComplete');
                        return currentConnection;
                    });
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        }

        return currentConnection;
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
     * Async Version
     * Look up a document by the fieldName and fieldValue in a repo by name.
     * @param fieldName String of the field name.
     * @param fieldValue String of the field value.
     * @param repoName ie. "Account"
     */
    async fetchDataAsync(fieldName, fieldValue, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            repo.findOne({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    fetchLastId(repoName, callback) {
        const repo = this.connection.getRepository(repoName);
        repo.findOne({order: {id: "DESC"}}).then(res => {
            callback(res);
        });
    }

    /**
     *
     * @param fieldName The name of the field.
     * @param fieldValue The value of that field.
     * @param repoName The reponame where to look.
     * @param callback Result is an array or undefined.
     */
    fetchAllByField(fieldName, fieldValue, repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        repo.find({ where: { [fieldName]: fieldValue } })
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     *
     * @param fieldName The name of the field.
     * @param fieldValue The value of that field.
     * @param repoName The reponame where to look.
     */
    async fetchAllByFieldAsync(fieldName, fieldValue, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            repo.find({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id or UNDEFINED.
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
     * Async Version
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     */
    async upsertDataAsync(document, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            repo.save(document)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id.
     */
    insertData(document, repoName, callback) {
        const repo = this.connection.getRepository(repoName);

        repo.insert(document)
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     */
    async insertDataAsync(document, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            repo.insert(document)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
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
                        console.error(err);
                        return callback(undefined);
                    });
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async
     * Update partial data for a document; based on object data based.
     * @param id ID of Document
     * @param partialObjectData Object
     * @param repoName The name of the table.
     */
    updatePartialDataAsync(id, partialObjectData, repoName) {
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
     * Async Version
     * Fetch documents by ID or IDs.
     * @param ids
     * @param repoName The name of the table.
     */
    fetchByIdsAsync(ids, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);
            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            repo.findByIds(idRef)
                .then(res => {
                    if (res.length <= 0) return callback(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
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
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Delete documents from the database by ID.
     * @param ids Can be array or single id.
     * @param repoName The name of the table.
     */
    deleteByIdsAsync(ids, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            repo.delete(idRef)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
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
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Fetch all documents by repo name.
     * @param repoName The name of the table.
     */
    fetchAllDataAsync(repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            repo.find()
                .then(res => {
                    if (res.length <= 0) return reject(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
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

    /**
     * Async Version
     * Select a table by fieldNames that apply.
     * @param repoName
     * @param fieldNamesArray
     */
    async selectDataAsync(repoName, fieldNamesArray) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            let selectionRef = fieldNamesArray;

            if (!Array.isArray(fieldNamesArray)) {
                selectionRef = [selectionRef];
            }

            repo.find({ select: selectionRef })
                .then(res => {
                    if (res.length <= 0) return reject(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }
}
