const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Display Orders"
    });
});


router.patch('/:orderId', (req, res, next) => {
    const id = req.params.productId;
    if (id == 'special') {
        res.status(200).json({
            message: "You patched the special ID",
            id: id
        });
    }
    else {
        res.status(200).json({
            message: "You patched an ID",
            id: id
        });
    }
});

module.exports = router;