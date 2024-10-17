'use strict';

module.exports = (sequelize, DataTypes) => {
  const userlog = sequelize.define('userlog', {
    descriptions: {
        type:DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty:true
        }
    },
    user: {
        type:DataTypes.STRING(50),
        validate: {
            notEmpty:true
        }
    },
    UserCode: {
        type:DataTypes.STRING(30)
    },
    ipaddr: {
        type:DataTypes.STRING(170)
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
  userlog.associate = function(models) {
        
  };
  return userlog;
};


