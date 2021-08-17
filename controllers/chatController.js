const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const Email = require('../utils/email');


const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


// this fetches message conversation between two users
exports.getMessages = catchAsync(async (req,res,next)=>{
  const { user } = req.params;

  const messages = await Message.find({$and: [{sender: {$in:[user, req.user.id]}}, {receiver: {$in:[user, req.user.id]}}]});

  res.status(200).json({
    status:"success",
    length:messages.length,
    message:messages
  })
});

exports.getRoomMessages = catchAsync(async (req,res,next)=>{
  let { room } = req.params;
  
  // check if user is a member of the room

  // get the messages for that room and return them
});

// Send messages to a room or directly to a user
exports.sendMessage = catchAsync(async (req,res)=>{
  const { type, receiver, message, medium, subject} = req.body;
  let sent = false;

  if(medium !== 'email' || medium !== 'sms'){
    res.status(400).json({
      status:"failed",
      error:"'medium' should either be 'email' or 'sms'"
    })
    return
  }

  if(type === 'direct'){
    if(medium === 'email'){
      sent = await sendEmailChat(req.user.id, receiver, subject, message)
    } else if(medium === 'sms'){
      sent = await sendSMSChat(req.user.id, receiver, message)
    }

    if(sent){
      res.status(200).json({
        status:"success",
        message:"Message was sent successfully"
      })
    } else {
      res.status(400).json({
        status:"failed",
        error:"Unable to send message via email"
      })
    }
    return
  } else if(type === 'group'){
    // check if user is a member of the room

    // create the message to that room and send to each member's email or sms inbox
  } else {
    res.status(400).json({
      status:"failed",
      error:"'type' should either be 'direct' or 'group'"
    })
    return
  }
  
});

//Edit previously sent message
exports.updateMessage = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'message');

  const updatedMessage = await Message.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedMessage,
    message: "Chat message updated successfully"
  });
});

// Mark a message as read
exports.markAsRead = catchAsync(async (req, res, next) => {
  const updatedMessage = await Message.findByIdAndUpdate(req.params.id, {read: true}, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedMessage,
    message: "Chat message updated successfully"
  });
});

exports.deleteMessage = factory.deleteOne(Message);

const sendEmailChat = async (user, receiver, subject="3reen", message) => {
  const recipient = await User.findOne({email: receiver}).select('_id');

  if(!recipient){
    return false
  }

  try{
    await new Email(recipient).sendChat(subject, message);

    const data = {
      content: message,
      sender: user,
      receiver: recipient._id,
    };
    await Message.create(data);
    return true
  } catch {
    return false
  }
  
}

const sendSMSChat = async (user, receiver, message) => {
  return true
}