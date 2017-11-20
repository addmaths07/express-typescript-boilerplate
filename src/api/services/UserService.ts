import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { EventDispatcher } from 'event-dispatch';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';
import { events } from '../subscribers/events';
import { Logger } from '../../decorators/Logger';
import { ILogger } from '../../core/ILogger';


@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @Logger(__filename) private log: ILogger
    ) { }

    public find(): Promise<User[]> {
        this.log.info('Find all users');
        return this.userRepository.find();
    }

    public findOne(id: string): Promise<User | undefined> {
        this.log.info('Find all users');
        return this.userRepository.findOne({ id });
    }

    public async create(user: User): Promise<User> {
        this.log.info('Create a new user => ', user.toString());
        const newUser = await this.userRepository.save(user);
        const eventDispatcher = new EventDispatcher();
        eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public update(id: string, user: User): Promise<User> {
        this.log.info('Update a user');
        user.id = id;
        return this.userRepository.save(user);
    }

    public delete(id: string): Promise<void> {
        this.log.info('Delete a user');
        return this.userRepository.removeById(id);
    }

}
