exports.up = async (pgm) => {
  pgm.createTable('operation_history', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      //references: 'users(id)',
    },
    object_type: { type: 'varchar(50)', notNull: true },
    object_id: { type: 'uuid', notNull: true },
    field_name: { type: 'varchar(100)', notNull: true },
    old_value: { type: 'text' },
    new_value: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('operation_history');
};