function hasPermission(user, permissionsNeeded) {
    const matchedPermissions = user.permissions.includes(permissionsNeeded)
    if (!matchedPermissions) {
      throw new Error(`You do not have sufficient permissions
        : ${permissionsNeeded}
        You Have:
        ${user.permissions}
        `);
    }
  }
  
  exports.hasPermission = hasPermission;