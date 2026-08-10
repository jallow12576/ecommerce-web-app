const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Register user
exports.register = async (req, res)=>{

    const {name, email, password} = req.body;


    try {

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        const sql = `
            INSERT INTO users(name,email,password)
            VALUES(?,?,?)
        `;


        db.query(
            sql,
            [name,email,hashedPassword],
            (err,result)=>{

                if(err){
                    return res.status(500).json({
                        message:"Database error",
                        error:err
                    });
                }


                res.status(201).json({
                    message:"User created successfully",
                    userId:result.insertId
                });

            }
        );


    } catch(error){

        res.status(500).json({
            message:"Server error",
            error
        });

    }

};

//login process
exports.login =  async (req, res) => {
    const {email, password} = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`

    db.query(sql, [email], async (err, result) => {
        if(err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            })
        }
        if(result.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        // if the process passes checking if there is a user or not: if there is a user then it returns the user:
        const user = result[0];

        //checking the password
        const isMatch = await bcrypt.compare(password, user.password);

        //if Passwords don't match:
        if(!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        //creating a jwt token for the authenticated user
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )

        // if the all process successfull then return:
        res.status(200).json({
            message: 'Login successfully',
            token: token
        })


    })
}

// a route to test if my middleware is actually working 

exports.getProfile = (req, res) => {
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user
    })
}



