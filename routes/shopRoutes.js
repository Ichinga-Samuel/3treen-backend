const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.status(200).json({succses: 'it works'})
})


exports.routes = router