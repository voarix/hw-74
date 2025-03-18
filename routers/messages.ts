import express from "express";
import {promises as fs} from 'fs';

const messagesRouter = express.Router();
const path = './messages';

const saveMessage = async (message: string) => {
    const date = new Date();
    const dateString = date.toISOString();
    const fileName = `${dateString}.txt`;
    const filePath = `${path}/${fileName}`;

    await fs.writeFile(filePath, JSON.stringify(message));
    return dateString;
};

messagesRouter.post('/create', async (req, res) => {
    try{
        const { message } = req.body;
        const dateTime = await saveMessage(message);
        res.send(JSON.stringify({ message, datetime: dateTime }));
    } catch (e) {
        console.error(e);
    }
});

messagesRouter.get('/', async (req, res) => {
    try {
        const allFiles = await fs.readdir(path);
        const fiveFilesAtTheEnd = allFiles.slice(-5).reverse();

        const messages = await Promise.all(
            fiveFilesAtTheEnd.map(async (fileName) => {
                const filePath = `${path}/${fileName}`;
                const content = await fs.readFile(filePath);
                return {
                    message: content.toString(),
                    datetime: fileName.replace('.txt', ''),
                };
            })
        );

        res.send(JSON.stringify(messages));
    } catch (e) {
        console.error(e);
    }
});

export default messagesRouter;
