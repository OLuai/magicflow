namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityRelationForViewDto
	{
		public MagicEntityRelationDto MagicEntityRelation { get; set; }

		public string MagicEntityName { get; set;}

		public string MagicChildEntityName { get; set;}

		public string RelationType { get; set; }

	}
}