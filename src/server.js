const { App } = require("./app");


class server {
    constructor(){
        const app = new App();
        app.listen();
    }
}
new server();