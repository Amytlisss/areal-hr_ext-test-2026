import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { File } from '../../files/entities/file.entity';
import { HrOperation } from '../../hr-operations/entities/hr-operation.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'passport_series', type: 'varchar', length: 10 })
  passportSeries: string;

  @Column({ name: 'passport_number', type: 'varchar', length: 10 })
  passportNumber: string;

  @Column({ name: 'passport_issue_date', type: 'date' })
  passportIssueDate: Date;

  @Column({ name: 'passport_code', type: 'varchar', length: 10, nullable: true })
  passportCode: string;

  @Column({ name: 'passport_issued_by', type: 'varchar', length: 255 })
  passportIssuedBy: string;

  @Column({ name: 'registration_region', type: 'varchar', length: 100, nullable: true })
  registrationRegion: string;

  @Column({ name: 'registration_locality', type: 'varchar', length: 100, nullable: true })
  registrationLocality: string;

  @Column({ name: 'registration_street', type: 'varchar', length: 100, nullable: true })
  registrationStreet: string;

  @Column({ name: 'registration_house', type: 'varchar', length: 10, nullable: true })
  registrationHouse: string;

  @Column({ name: 'registration_building', type: 'varchar', length: 10, nullable: true })
  registrationBuilding: string;

  @Column({ name: 'registration_apartment', type: 'varchar', length: 10, nullable: true })
  registrationApartment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => File, (file) => file.employee)
  files: File[];

  @OneToMany(() => HrOperation, (hrOperation) => hrOperation.employee)
  hrOperations: HrOperation[];
}