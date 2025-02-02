import { ForbiddenException, GoneException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { CreatePositionDto } from './dto/positions.dto';

@Injectable()
export class PositionsService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}


    async createPositions(user: UserType, { position, poll_id, description }: CreatePositionDto) {

        const createPositionResult = await this.sql`
            INSERT INTO positions (position, description, poll_id)
            VALUES (${position}, ${description}, ${poll_id})
            RETURNING *;
        `

        if(!createPositionResult.length) throw new GoneException('failed to create position')

        return createPositionResult[0];
    }

    async getPositions(pollId: string) {
        // should i apply admin, branch and other restrictions
        const getPositionResult = await this.sql`
            SELECT * FROM positions
            WHERE poll_id = ${pollId}
            ORDER BY id
        `

        return getPositionResult;
    }

    async getPositionOptions(pollId: string) {
        const getPositionsOptions = await this.sql`
            SELECT id, position FROM positions
            WHERE poll_id = ${pollId}
        `

        return getPositionsOptions;
    }

    async updatePosition(user: UserType, body: CreatePositionDto, positionId:string) {
        
        const updatePositionResult = await this.sql`
            UPDATE positions SET
                position = COALESCE(${body.position}, position),
                description = COALESCE(${body.description}, description)
            WHERE id = ${positionId}
            RETURNING *;
        `

        if(!updatePositionResult.length) throw new GoneException('failed to update position')

        return updatePositionResult[0];
    }

    async deletePosition(user: UserType, positionId: string, poll_id: string) {
    
        const deletePositionResult = await this.sql`
            DELETE FROM positions
            WHERE id = ${positionId}
            RETURNING *;
        `

        if(!deletePositionResult.length) throw new GoneException('failed to delete position')

        return deletePositionResult[0];
    }
    
}
