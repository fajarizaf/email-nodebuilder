'use strict';
module.exports = (sequelize, DataTypes) => {
  const template_email = sequelize.define('template_email', {
    template_name: {
      type:DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty:true
      }
    },
    template_desc: {
      type:DataTypes.TEXT,
      allowNull: false
    },
    template_group: {
      type:DataTypes.STRING(100),
      allowNull: false
    },
    template_subject: {
      type:DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty:true
      }
    },
    template_body: {
      type:DataTypes.TEXT,
      allowNull: false
    },
  }, {});
  template_email.associate = function(models) {
    
  };
  return template_email;
};
