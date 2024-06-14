import express, {Express, Request, Response} from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddlewaree } from "./middlewares/errors";

const app:Express = express();


app.get('/', (req:Request, res:Response) => {
    res.send("App running");
    res.json()
});

app.use(express.json());

app.use('/api', rootRouter)


export const prismaClient = new PrismaClient({
    log:["query"]
}).$extends({
    result: {
        address:{
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (address) => {
                    return `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country} - ${address.pincode} `
                }
            }
        }
    }
})

app.use(errorMiddlewaree);

app.listen(PORT, () => {
    console.log(`Sever started on port ${PORT}`);
})