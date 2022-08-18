﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class PalestranteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string ImagemUrl { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string MiniCurriculo { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        //public int UserId { get; set; }
        //public User User { get; set; }
        public IEnumerable<PalestranteDto> PalestrantesEventos { get; set; }
    }
}
