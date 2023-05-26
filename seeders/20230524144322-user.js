'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [{


                email: 'user1@example.com',
                password: "password1",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {

                email: 'user2@example.com',
                password: "password2",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },




    // user





    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};