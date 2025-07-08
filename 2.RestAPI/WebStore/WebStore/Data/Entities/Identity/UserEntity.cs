using Microsoft.AspNetCore.Identity;

namespace WebStore.Data.Entities.Identity;

public class UserEntity : IdentityUser<long>
{
    public string? FirstName { get; set; } = null;
    public string? LastName { get; set; } = null;
    public string? Image { get; set; } = null;

    public virtual ICollection<UserRoleEntity>? UserRoles { get; set; } = null;
}
