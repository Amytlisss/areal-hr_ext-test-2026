import{Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import{Organization} from '../../organizations/entities/organization.entity';

@Entity('departments')
export class Department{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name:'organization_id', type:'uuid'})
  organizationId:string;

  @ManyToOne(()=>Organization)
  @JoinColumn({name:'organization_id'})
  organization:Organization;

  @Column({name:'parent_id', type: 'uuid', nullable: true})
  parentId:string | null;

  @ManyToOne(()=>Department, {nullable: true})
  @JoinColumn({name:'parent_id'})
  parent:Department | null;

  @Column({type: 'varchar', length: 255})
  name: string;

  @Column({ type:'text', nullable: true})
  comment: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @Column({name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}