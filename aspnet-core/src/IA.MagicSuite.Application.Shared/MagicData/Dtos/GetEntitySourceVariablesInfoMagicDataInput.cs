using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IA.MagicSuite.MagicData.Dtos
{
    public class GetEntitySourceVariablesInfoMagicDataInput
    {

        public string EntityId { get; set; }

       
        public bool UpdateEntityVariables { get; set; }



    }
}
