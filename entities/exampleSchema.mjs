export const Account = new orm.EntitySchema({
    name: 'Account',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        username: {
            type: 'text',
            nullable: false,
        },
        email: {
            type: 'text',
            nullable: false,
        },
        password: {
            type: 'varchar',
            nullable: false,
        },
    },
});
