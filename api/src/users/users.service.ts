import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId, deletedAt: IsNull() },
    });
    if (!role) {
      throw new BadRequestException(`Role with ID ${createUserDto.roleId} not found`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { login: createUserDto.login, deletedAt: IsNull() },
    });
    if (existingUser) {
      throw new ConflictException(`User with login ${createUserDto.login} already exists`);
    }

    const passwordHash = await argon2.hash(createUserDto.password,
      {type: argon2.argon2id,}
    );

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(user);
    return this.toResponseDto(savedUser, role.name);
  }

  async findAll(filters: { search?: string; roleId?: string; includeDeleted?: string }): Promise<UserResponseDto[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (filters.includeDeleted !== 'true') {
      queryBuilder.andWhere('user.deletedAt IS NULL');
    }

    if (filters.roleId) {
      queryBuilder.andWhere('user.roleId = :roleId', { roleId: filters.roleId });
    }

    if (filters.search && filters.search.trim()) {
      queryBuilder.andWhere(
        '(user.lastName ILIKE :search OR user.firstName ILIKE :search OR user.login ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('user.createdAt', 'DESC');

    const users = await queryBuilder.getMany();
    return users.map(user => this.toResponseDto(user, user.role.name));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toResponseDto(user, user.role.name);
  }

  async findByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { login, deletedAt: IsNull() },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with login ${login} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {

    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['role'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let newRole: Role | null = null;
    if (updateUserDto.roleId) {
      newRole = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId, deletedAt: IsNull() },
      });
      if (!newRole) {
        throw new BadRequestException(`Role with ID ${updateUserDto.roleId} not found`);
      }
    }

    if (updateUserDto.login && updateUserDto.login !== user.login) {
      const existingUser = await this.userRepository.findOne({
        where: { login: updateUserDto.login, deletedAt: IsNull() },
      });
      if (existingUser) {
        throw new ConflictException(`User with login ${updateUserDto.login} already exists`);
      }
    }

    if (updateUserDto.password) {
      const passwordHash = await argon2.hash(updateUserDto.password,
        {type: argon2.argon2id,}
      );
      user.passwordHash = passwordHash;
      delete updateUserDto.password; 
    }

    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();

    const savedUser = await this.userRepository.save(user);

    const roleName = newRole ? newRole.name : user.role.name;

    return this.toResponseDto(savedUser, roleName);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return argon2.verify(user.passwordHash, password);
  }

  private toResponseDto(user: User, roleName: string): UserResponseDto {
    return {
      id: user.id,
      employeeId: user.employeeId,
      lastName: user.lastName,
      firstName: user.firstName,
      middleName: user.middleName,
      login: user.login,
      roleId: user.roleId,
      roleName: roleName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}