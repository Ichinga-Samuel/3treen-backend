const Message = require('../models/messageModel');

const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

exports.getMyMessages = catchAsync(async (req, res, next) => {
  // Get messages logged in user is a sender or receiver
  const messages = await Message.aggregate([
    {
      $match: { $or: [{ recieverId: req.user.id }, { senderId: req.user.id }] },
    },

    {
      $group: {
        _id: '$roomId',

        numMessages: { $sum: 1 },

        messages: {
          $push: {
            body: '$body',
            timeStamp: '$timeStamp',
            sender: '$sender',
            reciever: '$reciever',
            roomId: '$roomId',
          },
        },
      },
    },
  ]);

  const lastChats = messages
    .map((el) => el.messages[el.messages.length - 1])
    .sort((a, b) => b.timeStamp - a.timeStamp);

  res.status(200).json({
    results: messages.length,
    status: 'success',
    lastChats,
  });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  //Get reciever from request body
  const { reciever } = req.params;

  //Get message body from request object
  const { body } = req.body;

  //Create Message
  const message = await Message.create({
    sender: req.user.id,
    reciever,
    body,
  });

  //Send response
  res.status(200).json({
    status: 'success',
    message,
  });
});

exports.getAllMessages = factory.getAll(Message);

exports.getChatsBetweenUsers = catchAsync(async (req, res, next) => {
  //Get room Id from params
  const { roomId } = req.params;

  //Find messages with that room Id field
  const messages = await Message.find({ roomId });

  //Send response
  res.status(200).json({
    status: 'success',
    messages,
  });
});
