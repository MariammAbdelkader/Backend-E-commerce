const { User } = require('../models/user.models');
const { UserRole } = require('../models/userRole.models'); 
const { Role } = require('../models/role.models');
const userId = process.argv[2];

if (!userId) {
  console.error("❌ Please provide a userId. Example: npm run upgrade 1");
  process.exit(1);
}

async function upgradeUserToAdmin(userId) {
  try {

    // Get the admin role
    const adminRole = await Role.findOne({ where: { roleName: 'Admin' } });

    if (!adminRole) {
      console.error("❌ Admin role not found. Make sure it exists in your Roles table.");
      process.exit(1);
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      console.error(`❌ User with ID ${userId} not found.`);
      process.exit(1);
    }

    // Check if the user already has the admin role
    const existingRole = await UserRole.findOne({
      where: {
        userId: userId,
        roleId: adminRole.roleId
      }
    });

    if (existingRole) {
      console.log(`✅ User ${userId} is already an admin.`);
      process.exit(0);
    }


    const userRole = await UserRole.findOne({
      where: {
        userId: userId,
      }
    });
    if(!userRole) {
      console.error(`❌ UserRole for user ${userId} not found. Please ensure the user has a role assigned.`);
      process.exit(1);
    }
    // Assign the admin role to the user
    await userRole.update({
      roleId: adminRole.roleId
    });

    console.log(`🎉 User ${userId} has been upgraded to admin.`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error upgrading user:", error);
    process.exit(1);
  }
}

upgradeUserToAdmin(userId);
