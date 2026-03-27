import{Injectable, NotFoundException} from '@nestjs/common';
import{InjectRepository} from '@nestjs/typeorm';
import{Repository, IsNull} from 'typeorm';
import{Organization} from "./entities/organization.entity";
import{CreateOrganizationDto} from "./dto/create-organization.dto";
import{UpdateOrganizationDto} from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository:Repository<Organization>,
  ) {}

  async create(createOrganizationDto:CreateOrganizationDto):Promise<Organization> {
    const organization=this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]>{
    return this.organizationRepository.find({
      where:{deletedAt:IsNull()},
      order:{ createdAt:"DESC"},
    });
  }

  async findOne(id:string):Promise<Organization>{
    const organization=await this.organizationRepository.findOne({
      where:{id, deletedAt:IsNull()},
    });
    if (!organization){
      throw new NotFoundException("Organization with ID ${id} not found");
    }
    return organization;
  }

  async update(id:string, updateOrganizationDto:UpdateOrganizationDto): Promise<Organization> {
    const organization=await this.findOne(id);
    Object.assign(organization, updateOrganizationDto);
    organization.updatedAt=new Date();
    return this.organizationRepository.save(organization);
  }

  async remove(id:string):Promise<void> {
    const organization=await this.findOne(id);
    organization.deletedAt=new Date();
    await this.organizationRepository.save(organization);
  }
}