// const amqp = require('amqplib/callback_api')
const amqp = require('amqplib')
const http = require('http')

const hostname = '127.0.0.1'
const port = 3000;
const queue = "y_queue"

// Consumer Promise
function consumerPromise(connection) {
    connection.createChannel().then(function (ch) {
        return ch.assertQueue(q).then(function (ok) {
            return ch.consume(q, function (msg) {
                if(msg !== null) {
                    console.log(msg.content.toString());
                    ch.ack(msg);
                }
            });
        });
    }).catch(console.warn);
}

// publisherPromise
function publisherPromise(connection) {
    connection.createChannel().then(function (ch) {
        return ch.assertQueue(q).then(function (ok) {
            const msg = 'Greetings from promise';
            return ch.sendToQueue(q, Buffer.from(msg))
        });
    }).catch(console.warn)
}

// Consumer Callback
/* function consumerCallback(connection) {
    connection.createChannel(function (err, channel) {
        if(err) {
            throw err;
        }
        channel.assertQueue(queue, {
            durable: false
        });
        channel.consume(queue, function (message) {
            console.log("message received")
            console.log(message)
            console.log(message.content.toString())
            channel.ack(message);
        }, { noAck: false });
    });
}

// publisherCallback
function publisherCallback(connection) {
    connection.createChannel(function (err, channel) {
        if(err) {
            throw err;
        }
        const msg = 'Greetings from callback';
        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log("Sent message: %s", msg);
    });
}

// Consumer Callback
function consumerCallback(connection) {
    connection.createChannel(function (err, channel) {
        if(err) {
            throw err;
        }
        channel.assertQueue(queue, {
            durable: false
        });
        channel.consume(queue, function(message) {
            console.log("message received")
            console.log(message)
            console.log(message.content.toString())
            channel.ack(message);
        }, { noAck: false });
    });
} */

function publishConsumeMessagePromise() {
    // amqp://localhost:5672
    amqp.connect('amqp://guest:guest@localhost:5672/', function (err, connection) {
        if(err) {
            console.error("error", err)
            throw err;
        }
        consumerPromise(connection);
        publisherPromise(connection);
        console.log("connected promise")
        /* setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500); */
    });
}

function publishConsumeMessageCallBack() {
    // amqp://localhost:5672
    amqp.connect('amqp://guest:guest@localhost:5672/', function (err, connection) {
        if(err) {
            console.error("error", err)
            throw err;
        }
        consumerCallback(connection);
        publisherCallback(connection);
        console.log("connected callback")
        /* setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500); */
    });
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Greeting');
});

server.listen(port, hostname, () => {
    // publishConsumeMessageCallBack()
    publishConsumeMessagePromise()
    console.log(`Server running at http://${hostname}:${port}/`);
});

