import express from 'express'
import { Authenticate } from '../middleware/Authenticate.js';
 
import { submitContactForm } from '../controllers/ContactController.js';

const ContactRouter = express.Router();

ContactRouter.post('/', submitContactForm);
// ContactRouter.get('/',Authenticate,owner,getAllContactMessages)
// ContactRouter.patch('/reply/:id', Authenticate, owner, replyContactMessage);
// ContactRouter.delete('/:id', Authenticate, owner,deleteContactMessage)

export default ContactRouter;