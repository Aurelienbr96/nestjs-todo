import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { AuthGuard } from '../auth/guards';
import { UseAuthGuard } from '../auth/decorators/use-auth-guard.decorator';
// import { UserModel } from '../auth/type';
import { Auth } from '../auth/decorators';

import { UserService } from './user.service';
import { UserToUpdateDTO } from './dto/user-to-update.dto';
import { UserSelfGuard } from './guards/user-self.guard';
import { RelationCoachToClientToCreateDTO } from './dto/relation-coach-to-client';
import { UserToCoachService } from './user-to-coach.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private user: UserService, private userToCoach: UserToCoachService) {}

  @ApiOperation({ summary: 'Get list of users' })
  @UseAuthGuard(Role.ADMIN)
  @Get()
  async findAll() {
    const users = await this.user.findAll();
    return users;
  }

  @ApiOperation({ summary: 'add client for coach' })
  @UseGuards(AuthGuard)
  @Post('/link-user-to-coach')
  async AddClient(@Body() linkedIds: RelationCoachToClientToCreateDTO) {
    const coach = await this.user.findByReferalCode(linkedIds.referalCode);
    if (!coach) {
      throw new Error('coach not found');
    }
    await this.userToCoach.create(linkedIds.clientId, coach.id);
  }

  @ApiOperation({ summary: 'generate referal code' })
  @UseAuthGuard(Role.COACH)
  @Put('/generate-referal-code')
  async GenerateReferalCode(@Auth() auth: { sub: number; role: Role }) {
    const user = await this.user.updateOne({ referalCode: uuid() }, auth.sub);
    if (!user?.password) return user;
    const { password, refresh, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, UserSelfGuard)
  @ApiOperation({ summary: 'delete one user' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedUser = await this.user.deleteOne(id);
      return { id: deletedUser.id, email: deletedUser.email };
    } catch (e) {
      throw new NotFoundException(`the user for id:${id} has not been found`);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard, UserSelfGuard)
  @ApiOperation({ summary: 'update one user' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() user: UserToUpdateDTO) {
    try {
      const updatedUser = await this.user.updateOne(user, id);
      if (updatedUser?.password) {
        const { password, ...updatedUserWithoutPassword } = updatedUser;
        return updatedUserWithoutPassword;
      }
      return updatedUser;
    } catch (e) {
      throw new NotFoundException(`the user for id:${id} has not been found`);
    }
  }
}
