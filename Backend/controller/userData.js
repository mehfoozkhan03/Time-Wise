import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { userModel } from '../model/User.model.js';
import { AdminModel } from '../model/Admin.model.js';

const validation = (value) => {
  for (let key in value) {
    if (value[key].trim() !== '') {
      console.count('loop');
      continue;
    }
    return false;
  }
  return true;
};

export const signup = async (req, res) => {
  try {
    const deepChecks = validation(req.body);
    if (deepChecks) {
      const find_User_In_DB = await userModel.findOne({
        email: req.body.email,
      });
      console.log(`🚀 ~ find_User_In_DB:`, find_User_In_DB);
      if (find_User_In_DB) {
        res.send('user already exist in DB please login');
      } else {
        // find Admin

        const FindAdminID = await AdminModel.find();

        bcrypt.genSalt(+process.env.saltRounds, async function (err, salt) {
          if (err) {
            res.send(
              `this is error which i got in generate_salt method ${err}`,
            );
          }
          bcrypt.hash(req.body.password, salt, async function (err, hash) {
            console.log(`🚀 ~ hash:`, hash);
            // Store hash in your password DB.
            if (err) {
              res.send(`this is error which i got in has method ${err}`);
            }
            req.body.password = hash;
            const userCreted = await userModel.create({
              ...req.body,
              adminID: FindAdminID[0]._id,
            });
            res.send(userCreted);
          });
        });
      }
    } else {
      res.send('please enter somthing to save in DB...');
    }
  } catch (error) {
    res.send({ msg: 'something went wrong...', error });
  }
};

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
        res.send({ msg: 'admin login successfully', data: admin });
      } else {
        res.send('wrong crendential❌');
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
              res.send({ msg: 'this is error in compare', err });
            } else if (data) {
              const token = await jwt.sign(
                {
                  userID: userData?._id,
                  iat: Math.floor(Date.now() / 1000),
                  exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
                },
                process.env?.PrivateKey,
              );
              res.send({ msg: 'user successfully logged-in', token });
            } else {
              res.send({ msg: 'password not correct❌❗', response: req.body });
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
