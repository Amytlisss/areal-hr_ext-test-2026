import{Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('positions')
export class Position{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 255})
  name:string;

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:"updated_at"})
  updatedAt:Date;

  @Column({name:"deleted_at", type:"timestamp", nullable:true})
  deletedAt: Date | null;
}