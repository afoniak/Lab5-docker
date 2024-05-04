const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const { MONGO_DB_HOSTNAME, MONGO_DB_PORT, MONGO_DB } = process.env;

const orderSchema = new Schema(
    {
        pizza_name: String,
        client_name: String,
        date_order_end: Date,
        sum: Number,
    },
    { versionKey: false }
);
const Order = mongoose.model('Order', orderSchema);


app.use(express.static(__dirname + '/public'));


mongoose
    .connect(`mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`)
    .then(() => {
        console.log('Connection to MongoDB established successfully.');
        app.listen(3000, () => {
            console.log('Сервер працює на порті 3000');
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

    
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.send(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving orders.');
    }
});


app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.send(order);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error finding order.');
    }
});


app.post('/api/orders', jsonParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);


    const order = new Order({
        pizza_name: req.body.pizza_name,
        client_name: req.body.client_name,
        date_order_end: new Date(req.body.date_order_end),
        sum: req.body.sum,
    });


    try {
        const savedOrder = await order.save();
        res.send(savedOrder);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error saving order.');
    }
});


app.delete('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        res.send(order);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting order.');
    }
});


app.put('/api/orders', jsonParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);


    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.body.id,
            {
                pizza_name: req.body.pizza_name,
                client_name: req.body.client_name,
                date_order_end: new Date(req.body.date_order_end),
                sum: req.body.sum,
            },
            { new: true }
        );
        res.send(updatedOrder);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating order.');
    }
});
