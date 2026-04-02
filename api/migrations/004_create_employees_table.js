exports.up = async (pgm) => {
  pgm.createTable('employees', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    last_name: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    middle_name: { type: 'varchar(100)' },
    birth_date: { type: 'date', notNull: true },
    passport_series: { type: 'varchar(10)', notNull: true },
    passport_number: { type: 'varchar(10)', notNull: true },
    passport_issue_date: { type: 'date', notNull: true },
    passport_code: { type: 'varchar(10)' },
    passport_issued_by: { type: 'varchar(255)', notNull: true },
    registration_region: { type: 'varchar(100)' },
    registration_locality: { type: 'varchar(100)' },
    registration_street: { type: 'varchar(100)' },
    registration_house: { type: 'varchar(10)' },
    registration_building: { type: 'varchar(10)' },
    registration_apartment: { type: 'varchar(10)' },
    created_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('now()'), notNull: true },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('employees');
};