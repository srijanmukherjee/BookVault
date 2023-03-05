import { IncomingMessage } from "http";
import { Socket } from "net";

export default class ExtendedIncomingMessage extends IncomingMessage {
    constructor(socket: Socket) {
        super(socket);
    }
} 