using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Data;

namespace ProEventos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly DataContext _context;
        public EventoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok(_context.Eventos.ToList());
        }
    }
}
