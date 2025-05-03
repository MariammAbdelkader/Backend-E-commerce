const emitter = require('../eventEmitter');
const { logActivity } = require('../../utilities/logActivity');


emitter.on('userActivity', (data) => {    
    logActivity(data)
        .then(() => {
            console.log('Activity logged successfully:', data);
        })
        .catch((error) => {
            console.error('Error logging activity:', error);
        });
});

module.exports = emitter;