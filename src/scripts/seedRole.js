const { Role } = require("../models/role.models");

const seedRoles = async () => {
  const roles = ["Customer", "Admin", "ShopOwner"];

  for (const roleName of roles) {
    const exists = await Role.findOne({ where: { roleName } });
    if (!exists) {
      await Role.create({ roleName });
      console.log(`✅ Role '${roleName}' created`);
    }
  }
};

module.exports = seedRoles;
