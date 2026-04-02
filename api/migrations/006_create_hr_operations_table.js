exports.up = async (pgm) => {
  pgm.createTable('hr_operations', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    employee_id: {
      type: 'uuid',
      notNull: true,
      references: 'employees(id)',
    },
    operation_type: { type: 'varchar(50)', notNull: true },
    department_id: {
      type: 'uuid',
      references: 'departments(id)',
    },
    position_id: {
      type: 'uuid',
      references: 'positions(id)',
    },
    salary: { type: 'decimal(10,2)' },
    operation_date: { type: 'date', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('hr_operations');
};