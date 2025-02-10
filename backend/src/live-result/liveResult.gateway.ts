import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class LiveResultGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    io: Server

    private logger = new Logger(LiveResultGateway.name)

    // set up the connectio between the user and the socket id
    socketIdToUserId = {};
    userIdToSocketId = {};

    afterInit() {
        this.logger.log(LiveResultGateway.name + " dependencies initialized")
    }
 
    @SubscribeMessage('joinPollResultRoom')
    async handleJoinRoomUser(@MessageBody() data: { pollId: string }, @ConnectedSocket() socket: Socket): Promise<WsResponse<any>> {
        // pollId is based on rooms id
        socket.join(data.pollId)
        
        return {
            event: 'room-joined',
            data: 'successfully join the room poll!'
        }
    }

    async handleConnection(client: any, ...args: any[]) {
        const userId = client.handshake.query.userId
        const socketId = client.id

        if(!userId) {
            throw new WsException('user Id is missing!')
        }

        // saving the user
        this.socketIdToUserId[socketId] = userId;
        this.userIdToSocketId[userId] = socketId;

        // logging
        this.logger.log("Client connected: " + userId);
    }

    async handleDisconnect(client: any) {
        const userId = client.handshake.query.userId
        const socketId = client.id

        if(!userId) {
            throw new WsException('user Id is missing!');
        }

        // deleting the user from the memory
        delete this.userIdToSocketId[userId]
        delete this.socketIdToUserId[socketId]

        // logging
        this.logger.log("Client disconnected: " + userId)
    }
}