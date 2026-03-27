exports.up = async(pgm)=>{
  pgm.createTable('departments', {
    id: {
      type:'uuid',
      default:pgm.func('gen_random_uuid()'),
      notNull:true,
      primaryKey:true,
    },
    organization_id: {
      type:'uuid',
      notNull:true,
      references:'organizations(id)',
      onDelete:'CASCADE',
    },
    parent_id: {
      type:'uuid',
      references:'departments(id)',
      onDelete:'CASCADE',
    },
    name: { type:'varchar(255)', notNull: true},
    comment: { type:'text' },
    created_at: { type:'timestamp', default: pgm.func('now()'), notNull: true},
    updated_at: { type:'timestamp', default: pgm.func('now()'), notNull: true},
    deleted_at: { type:'timestamp'},
  });
};

exports.down = async (pgm)=>{
  pgm.dropTable('departments');
};