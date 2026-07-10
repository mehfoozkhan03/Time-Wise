import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { userModel } from "../model/User.model.js";
import { AdminModel } from "../model/Admin.model.js";

const validation = (value) => {
  for (let key in value) {
    if (value[key].trim() !== "") {
      // console.count("loop");
      continue;
    }
    return false;
  }
  return true;
};

export const signup = async (req, res) => {
  try {
    const deepChecks = validation(req.body)

    if (!deepChecks) {
      return res.status(400).send('Please enter all required fields.')
    }

    const find_User_In_DB = await userModel.findOne({
      email: req.body.email,
    })

    if (find_User_In_DB) {
      return res.status(409).send('User already exists. Please login.')
    }

    // Find Admin
    const FindAdminID = await AdminModel.find()

    bcrypt.genSalt(+process.env.saltRounds, async function (err, salt) {
      if (err) {
        return res.status(500).send({
          msg: 'Error generating salt',
          error: err,
        })
      }

      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        if (err) {
          return res.status(500).send({
            msg: 'Error hashing password',
            error: err,
          })
        }

        // Hash password
        req.body.password = hash

        // Create full name automatically
        const fullName = `${req.body.firstName} ${req.body.lastName}`.trim()

        const userCreated = await userModel.create({
          ...req.body,

          adminID: FindAdminID[0]?._id ?? null,
        })

        res.status(201).json({
          msg: 'User created successfully',
          user: userCreated,
        })
      })
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Something went wrong...',
      error,
    })
  }
}

/*
admin user_name: admin
admin user_pass: admin@123
*/

export const admin_login = async (req, res) => {
  try {
    const deepChecks = validation(req.body);
    if (deepChecks) {
      const admin = await userModel.findOne(req.body);
      if (admin) {
        res.send({ msg: "admin login successfully", data: admin });
      } else {
        res.send("wrong crendential❌");
      }
    } else {
      res.send(`please enter somthing in body`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const deepChecks = validation(req.body);
    if (deepChecks) {
      const userData = await userModel.findOne({ email: req.body.email });
      console.log(`🚀 ~ userData:`, userData);

      if (userData) {
        bcrypt.compare(
          req.body?.password,
          userData?.password,
          async function (err, data) {
            if (err) {
              res.send({ msg: "this is error in compare", err });
            } else if (data) {
              const token = await jwt.sign(
                {
                  userID: userData?._id,
                  iat: Math.floor(Date.now() / 1000),
                  exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
                },
                process.env?.PrivateKey,
              );
              res.send({ msg: "user successfully logged-in", token });
            } else {
              res.send({ msg: "password not correct❌❗", response: req.body });
            }
          },
        );
        // res.send(`🚀 ~ userData:`, userData);
      } else {
        res.send({ msg: `user not present in DB, please signup first...` });
      }
    } else {
      res.send(`please enter somthing in body`);
    }
  } catch (error) {
    res.send(`something went wrong`);
  }
};
