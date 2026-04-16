exports.up = async (pgm) => {
  pgm.createTable('roles', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    name: { type: 'varchar(50)', unique: true, notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    deleted_at: { type: 'timestamp' },
  });

  pgm.sql(`
    INSERT INTO roles (name) VALUES 
      ('admin'),
      ('hr_manager')
    ON CONFLICT (name) DO NOTHING;
  `);
};

exports.down = async (pgm) => {
  pgm.dropTable('roles');
};