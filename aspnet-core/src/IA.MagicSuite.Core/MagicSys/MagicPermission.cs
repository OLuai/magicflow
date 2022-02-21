using Abp.Auditing;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IA.MagicSuite.MagicSys
{
    [Table("IASYS_Permissions")]
    [Audited]
	public class MagicPermission : FullAuditedEntity<string>, IMayHaveTenant
    {
		public MagicPermission()
		{
			IsActive = true;			
		}
		public int? TenantId { get; set; }


		/// <summary>
		///  a system-wide unique name.It's a good idea to define a const string for a permission name instead of a magic string. We prefer to use . (dot) notation for hierarchical names but it's not required.You can set any name you like.The only rule is that it must be unique.
		/// </summary>
		[Required]
		[StringLength(400)]
		public virtual string Name { get; set; }

		/// <summary>
		/// A string used to show the permission later in UI if localizationName is null.
		/// </summary>
		[StringLength(150)]
		public virtual string DisplayName { get; set; }

		/// <summary>
		/// A localizable string that can be used to show the permission later in UI.
		/// </summary>
		[StringLength(150)]
		public virtual string LocalizationName { get; set; }


		/// <summary>
		/// A string that can be used to show the definition of the permission later in UI.
		/// </summary>
		[StringLength(MagicAppConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }

		/// <summary>
		/// A localizable string that can be used to show the definition of the permission later in UI.
		/// </summary>
		[StringLength(150)]
		public virtual string DescriptionLocalizationName { get; set; }


		/// <summary>
		/// For the multi-tenant application, a permission can be used by tenants or the host.This is a Flags enumeration and thus a permission can be used on both sides.
		/// Host,Tenant
		/// </summary>
		[StringLength(150)]
		public virtual string MultiTenancySides { get; set; }

		/// <summary>
		/// Can be used to declare a dependency to features.Thus, this permission can be granted only if the feature dependency is satisfied.It waits for an object implementing IFeatureDependency.The default implementation is the SimpleFeatureDependency class. Example usage: new SimpleFeatureDependency("MyFeatureName")
		/// </summary>
		[StringLength(400)]
		public virtual string FeatureDependency { get; set; }

		public virtual bool IsActive { get; set; }
				
		public virtual string ParentId { get; set; }

		[ForeignKey("ParentId")]
		public MagicPermission PermissionFk { get; set; }

	}
}
