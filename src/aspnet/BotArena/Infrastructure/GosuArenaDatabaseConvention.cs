using System;
using System.Reflection;
using System.Runtime.CompilerServices;
using WeenyMapper.Conventions;

namespace GosuArena.Infrastructure
{
    public class DatabaseConvention : DefaultConvention
    {
        public override bool ShouldMapProperty(PropertyInfo propertyInfo)
        {
            if (!IsAutoProperty(propertyInfo))
                return false;

            return base.ShouldMapProperty(propertyInfo);
        }

        public override string GetTableName(Type entityType)
        {
            if (entityType.Name.EndsWith("y"))
            {
                return entityType.Name.Substring(0, entityType.Name.Length - 1) + "ies";
            }

            return entityType.Name + "s";
        }

        private bool IsAutoProperty(PropertyInfo propertyInfo)
        {
            return (propertyInfo.GetGetMethod() ?? propertyInfo.GetSetMethod()).IsDefined(typeof(CompilerGeneratedAttribute), false);
        }
    }
}