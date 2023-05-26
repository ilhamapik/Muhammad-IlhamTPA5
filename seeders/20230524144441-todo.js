'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Todos', [{
                title: 'Todo 1',
                description: 'Description 1',
                startTime: new Date(),
                status: 'Pending',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Todo 2',
                description: 'Description 2',
                startTime: new Date(),
                status: 'Completed',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Add more seed data as needed
        ], {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Todos', null, {});
    }
};