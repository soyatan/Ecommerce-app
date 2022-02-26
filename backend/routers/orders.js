const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();
const mongoose = require("mongoose");
const { OrderItem } = require("../models/order-item");

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.post(`/`, async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (order) => {
      let newOrderItem = new OrderItem({
        quantity: order.quantiy,
        product: orderItemIds.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsResolved = await orderItemIds;
  const totalPrices = await Promise.all(
    orderItemsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => {
    a + b, 0;
  });

  let order = new Order({
    orderItems: orderItemIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    status: req.body.status,
    phone: req.body.phone,
    totalPrice: totalPrice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });
  order = await order.save();
  if (!order) {
    return res.status(500).send("The order cannot be created");
  }
  res.send(productz);
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("the order sales cant be generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});
module.exports = router;
