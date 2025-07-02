using Polly;
using Polly.Extensions.Http;

using System.Diagnostics;
using Serilog;

using Webjet.API.Services;

namespace Webjet.API;

public partial class Program
{
    public static void Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .Enrich.FromLogContext()
            .Enrich.WithProperty("TraceId", Activity.Current?.TraceId.ToString() ?? "")
            .WriteTo.Console()
            .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();

        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.AddEnvironmentVariables();

        // Add services to the container.
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        // builder.Services.AddOpenApi();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddMemoryCache();

        //var token = "sjd1HfkjU83ksdsm3802k";
        //var token = builder.Configuration["WebjetApiToken"];
        var token = Environment.GetEnvironmentVariable("WEBJET_API_TOKEN");

        Console.WriteLine("Token: " + token);

        // Register a resilient HttpClient
        builder.Services.AddHttpClient("WebjetAPI", client =>
        {
            client.BaseAddress = new Uri("http://webjetapitest.azurewebsites.net/");
            //client.DefaultRequestHeaders.Add("x-access-token", "sjd1HfkjU83ksdsm3802k");
            client.DefaultRequestHeaders.Add("x-access-token", token);
            client.Timeout = TimeSpan.FromSeconds(3);
        })
        // Add retry with exponential backoff
        .AddPolicyHandler(HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)),
                onRetry: (outcome, timespan, retryAttempt, context) =>
                {
                    Log.Logger.Warning("Retry {RetryAttempt} after {Delay}s due to {Reason}",
                            retryAttempt, timespan.TotalSeconds,
                            outcome.Exception?.Message ?? outcome.Result.StatusCode.ToString());
                }))
        // Add circuit breaker
        .AddPolicyHandler(HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync(
                handledEventsAllowedBeforeBreaking: 3,
                durationOfBreak: TimeSpan.FromSeconds(15)));

        builder.Services.AddScoped<IMovieService, MovieService>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            //app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors("AllowFrontend");

        app.MapGet("/api/movies", async (IMovieService svc) =>
        {
            var movies = await svc.GetAllMoviesAsync();
            return Results.Ok(movies);
        }).WithOpenApi();

        app.MapGet("/api/movies/{id}", async (string id, IMovieService svc) =>
        {
            var movies = await svc.GetMovieDetailsAsync(id);
            return movies != null ? Results.Ok(movies) : Results.NotFound();
        }).WithOpenApi();

        app.Run();
    }
}