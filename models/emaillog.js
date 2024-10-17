'use strict';

module.exports = (sequelize, DataTypes) => {
  const emaillog = sequelize.define('emaillog', {
    to: {
        type:DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    subject: {
        type:DataTypes.STRING(100),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    req: {
        type:DataTypes.TEXT('long'),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    res: {
      type:DataTypes.TEXT('long'),
      allowNull: true,
      validate: {
          notEmpty:false
    }
  },
  }, {});
  emaillog.associate = function(models) {
        
  };
  return emaillog;
};


