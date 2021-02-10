const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require('../fakeDb');


router.get('', function( req, res) {
    res.json({ items })
})


router.post('', function( req, res, next) {
    try {
        if (!req.body.name || !req.body.price){
            throw new ExpressError('Name and price are required', 400);
        }
        const newItem = {name: req.body.name, price: req.body.price};
        items.push(newItem);
        return res.status(201).json({added : newItem});
    }catch(err) {
        return next(err);
    }
})


router.get('/:name', (req, res) =>{
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError('Item not found', 404);
    }
    return res.json(foundItem);
})


router.patch('/:name', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price){
            throw new ExpressError('Name and price are required', 400);
        }
        const foundItem = items.find(item => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new ExpressError('Item not found', 404);
        }
        foundItem.name = req.body.name;
        foundItem.price =req.body.price;
        return res.status(200).json({updated: foundItem});
    }catch(err){
        return next(err);
    }
})


router.delete('/:name', (req, res) => {
    const foundItemIndex = items.findIndex(item => item.name === req.params.name);
    if (foundItemIndex === -1) {
        throw new ExpressError('Item not found', 404);
    }
    items.splice(foundItemIndex, 1);
    return res.json({message: 'Deleted'});
})

module.exports = router;
