import express from "express";
import { SignupSchema } from "./types";
import { UserModel } from "./schema";

const app = express()

app.use(express.json()); 

app.post("/signup", async (req, res) => {
    const {success, data} = SignupSchema.safeParse(req.body)

    if (!success) {
        res.status(411).json({message: "Incorrect inputs"})
        return;
    }

    const userExists = await UserModel.findOne({
        username: data.username
    })

    if (userExists) {
        res.status(412).json({
            message: "User already exists with this username"
        })
        return 
    }

    const response = await UserModel.create({
        username: data.username,
        password: data.password
    })

    res.status(200).json({
        id: response._id
    });
})

app.post("/signin", async(req, res) => {
    const {success, data}  = SignupSchema.safeParse(req.body);
    if(!success) {
        res.status(411).json({message: "Incorrect inputs"})
        return;
    }

    try {
        const user = await UserModel.findOne({
            username: data.username,
            password: data.password
        });
        if(!user) {
            res.status(401).json({
                message: "Invalid username or password"
            });
            return;
        }
        res.status(200).json({
            message: "Logged in successfully",
            id: user._id
        });
    }
    catch(error) {
        res.status(500).json("Internal server error")
   }
})

app.listen(3001);