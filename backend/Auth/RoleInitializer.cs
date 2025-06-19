using backend.Data;
using backend.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.Auth
{
    public class RoleInitializer
    {
        public static async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var dbContext = serviceProvider.GetRequiredService<AppDbContext>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();

            string[] roleNames = { "Administrator" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            var email = config["AdminAccount:Email"]
                ?? throw new ArgumentNullException("AdminAccount:Email");

            var password = config["AdminAccount:Password"]
                ?? throw new ArgumentNullException("AdminAccount:Password");

            var firstName = config["AdminAccount:FirstName"]
                ?? throw new ArgumentNullException("AdminAccount:FirstName");

            var lastName = config["AdminAccount:LastName"]
                ?? throw new ArgumentNullException("AdminAccount:LastName");

            var adminUser = await userManager.FindByEmailAsync(email);

            if (adminUser == null)
            {
                var newAdmin = new User
                {
                    FirstName = firstName,
                    LastName = lastName,
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    LockoutEnabled = false,
                    TwoFactorEnabled = false
                };

                var result = await userManager.CreateAsync(newAdmin, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Administrator");
                    await dbContext.SaveChangesAsync();
                }
            }
        }
    }
}