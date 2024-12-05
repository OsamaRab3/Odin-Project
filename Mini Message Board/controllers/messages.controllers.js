const { title } = require("process");
const messages = require("../data/messages");
const  getAllMessages =  (req, res) => {

 res.render('index', { title: 'Welcome to the Mini Messageboard', messages: messages });

};

const formPage = (req, res) => {
    res.render('form', { title: 'Add a New Message' });
};

const addNewMessage = (req, res) => {
    const { author, message } = req.body;
    messages.push({
        text: message,
        user: author,
        added: new Date(),
    });


    res.redirect('/');}






module.exports = {
    formPage,
    getAllMessages,
    addNewMessage
}