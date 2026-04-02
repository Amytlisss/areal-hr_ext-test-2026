exports.up = async (pgm) => {
  pgm.createTable('files', {
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
      onDelete: 'CASCADE',
    },
    name: { type: 'varchar(255)', notNull: true },
    file_path: { type: 'varchar(500)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('files');
};