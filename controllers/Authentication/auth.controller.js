const dao = require('../../db/mongodb/dao')
const jwt = require('jsonwebtoken')
const hasher = require('../../utils/helpers/hasher')
const {emailValidator, stringValidator} = require('../../utils/helpers/validator')
const dotenv = require('dotenv');
const {createResponse} = require('../../utils/createResponse')
dotenv.config();

const MemberModel = "Member";

const JWT_SECRET = process.env.JWT_SECRET;

class Auth {

    async signup(req, res, error) {
        const {fullname,email_address,password} = req.body

        console.log(fullname, email_address, password);

        if(!fullname || !email_address || !password){

            return createResponse(res,400,"please add all the fields");

        }

        if(membership_type == "connection member" && req.body.invited_by == null){
            return createResponse(res,400,"please provide a main member ID for this connection member you want to add");
        }

        if(!emailValidator(email_address)){
            return createResponse(res,400,"please provide a valid email address");
        }

        if(!stringValidator(fullname)){
            return createResponse(res, 400, "Full name should be a string with more than one character in length")
        }

        const foundEmail = await dao.findOne(MemberModel, {email_address:email_address})

        if(foundEmail ==null){

            const hashedPassword = hasher.hashKey(password);
            const savedUser = await dao.create(MemberModel, {fullname, email_address, password:hashedPassword});
            savedUser.password = null;
            if(savedUser._id != null){

                return createResponse(res, 200, "Saved user", savedUser);

            }else{

                return createResponse(res,400,"An error occured creating the user");

            }
        }else{

            return createResponse(res,400,"A user with the email already exists");

        }
    }
    
    
    async signin(req, res, error)
    {
        const {email_address,password} = req.body
        if(!email_address || !password) {
            return res.status(422).json({error: "Please provide the email and password"})
        }

        const foundUser = await dao.findOne(MemberModel, {email_address:email_address})
        if(foundUser == null){

            return createResponse(res,400,"email or password is incorrect");

        }else{

            const passwordCompare = hasher.compareKey(password,foundUser.password)

            if(passwordCompare == true){

                const token = jwt.sign({_id:foundUser._id}, JWT_SECRET)
                return createResponse(res, 200, "token", token);

            }else{

                return createResponse(res,400,"email or password is incorrect");

            }
        }
    }

    async updatePassword(req, res) {
        const {member_id, old_password, new_password} = req.body;
        if(!member_id || !old_password || !new_password){
            return res.status(422).json({error: "Please provide all the details"})
        }

        const foundUser = await dao.findOne(MemberModel, {_id:member_id})
        const passwordCompare = hasher.compareKey(old_password,foundUser.password)

        if(passwordCompare == true){
            const hashedPassword = hasher.hashKey(new_password);
            const updateUser = await dao.updateQuery(MemberModel, member_id, {password: hashedPassword});
            return createResponse(res, 200, "user password updated successfully");

        }else{

            return createResponse(res,400,"old password is incorrect");

        }

    }
}

module.exports = new Auth();