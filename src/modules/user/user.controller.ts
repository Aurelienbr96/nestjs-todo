import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AuthGuard } from '../auth/guards';
import { UseAuthGuard } from '../auth/decorators/use-auth-guard.decorator';

import { UserService } from './user.service';
import { UserToUpdateDTO } from './dto/user-to-update.dto';
import { UserSelfGuard } from './guards/user-self.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private user: UserService) {}

  @ApiOperation({ summary: 'Get list of users' })
  @UseAuthGuard(Role.ADMIN)
  @Get()
  async findAll() {
    const users = await this.user.findAll();
    return users;
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
