using Microsoft.EntityFrameworkCore;
using ProEventos.Application;
using ProEventos.Application.Contratos;
using ProEventos.Persistence;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connection = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<ProEventosContext>(
    context => context.UseSqlite(connection)
    );

builder.Services.AddControllers()
        .AddJsonOptions(options =>
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
        )
        .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling =
            Newtonsoft.Json.ReferenceLoopHandling.Ignore
        );

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddScoped<IEventosService, EventoService>();
builder.Services.AddScoped<ILoteService, LoteService>();
//builder.Services.AddScoped<ITokenService, TokenService>();
//builder.Services.AddScoped<IAccountService, AccountService>();
//builder.Services.AddScoped<IPalestranteService, PalestranteService>();
//builder.Services.AddScoped<IRedeSocialService, RedeSocialService>();
//builder.Services.AddScoped<IUtil, Util>();

builder.Services.AddScoped<IGeralPersist, GeralPersist>();
builder.Services.AddScoped<IEventoPersist, EventoPersist>();
builder.Services.AddScoped<ILotePersist, LotePersist>();
//builder.Services.AddScoped<IUserPersist, UserPersist>();
//builder.Services.AddScoped<IPalestrantePersist, PalestrantePersist>();
//builder.Services.AddScoped<IRedeSocialPersist, RedeSocialPersist>();

builder.Services.AddCors();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(x => x
.AllowAnyMethod()
.AllowAnyHeader()
.SetIsOriginAllowed(origin => true)
.AllowCredentials()
);


app.UseAuthorization();


app.MapControllers();


app.Run();
