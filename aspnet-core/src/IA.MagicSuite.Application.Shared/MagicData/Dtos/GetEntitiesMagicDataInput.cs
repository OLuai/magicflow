using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IA.MagicSuite.MagicData.Dtos
{
    public class GetEntitiesMagicDataInput
    {

        public bool RejectAllOnError { get; set; }

        [Required]
        //public List<GetMagicDataInput> Entities { 
        //    get; 
        //    set; }

        public string EntitiesString { 
            get { return _EntitiesString; } 
            set {
                _EntitiesString = value;
                _Entities = JsonConvert.DeserializeObject<List<GetMagicDataInput>>((string)value);
            } 
        }
        private string _EntitiesString;

        public Object Entities
        {
            get
            {
                return _Entities;
            }
            set
            {

                if (value.GetType() == typeof(string)){
                    _Entities = JsonConvert.DeserializeObject<List<GetMagicDataInput>>((string)value);
                }
                else
                {
                    try
                    {
                        _Entities = (List<GetMagicDataInput>) value;
                    }catch (Exception)
                    {
                        _Entities = new List<GetMagicDataInput>();
                    }

                    
                }
                
            }
        }
        private List<GetMagicDataInput> _Entities;

        
    }
}
