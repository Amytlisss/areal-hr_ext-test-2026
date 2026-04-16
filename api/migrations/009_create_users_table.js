exports.up = async (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    employee_id: {
      type: 'uuid',
      references: 'employees(id)',
      onDelete: 'SET NULL',
    },
    last_name: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    middle_name: { type: 'varchar(100)' },
    login: { type: 'varchar(100)', unique: true, notNull: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    role_id: { type: 'uuid', notNull: true, references: 'roles(id)' },
    created_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('users');
};