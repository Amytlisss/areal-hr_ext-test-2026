exports.up = async(pgm)=>{
  pgm.createTable('positions', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull:true,
      primaryKey:true,
    },
    name: {type:'varchar(255)', notNull:true},
    created_at: {type:'timestamp', default: pgm.func('now()'), notNull:true},
    updated_at: {type:'timestamp', default:pgm.func('now()'), notNull:true },
    deleted_at: {type:'timestamp'},
  });
};

exports.down = async(pgm) =>{
  pgm.dropTable('positions');
};