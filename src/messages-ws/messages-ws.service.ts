import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private conectedClients: ConectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.isActive) throw new Error('Userr no exist or inactive');
    this.checkUserConnection(user);
    this.conectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.conectedClients);
  }

  getUserNameBySocketId(socketId: string) {
    return this.conectedClients[socketId].user.fullName;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.conectedClients)) {
      const conectedClients = this.conectedClients[clientId];
      if (conectedClients.user.id === user.id)
        conectedClients.socket.disconnect();
      break;
    }
  }
}
