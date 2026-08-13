const db = ('../config/db');

exports.getProducts = async(req, res) => {
    db.query(
        'SELECT * FROM products', (err, result) => {
            if(err) {
                return res.status(500).json({
                    message: 'Database error'
                })
            }
            return res.status(200).json({
                products: result
            })
        }
    )
};