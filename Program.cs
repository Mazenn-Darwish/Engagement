using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using INV;
using INV.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<SongService>();
builder.Services.AddScoped<MusicSearchService>(_ =>
    new MusicSearchService(new HttpClient { BaseAddress = new Uri("https://itunes.apple.com/") }));
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<SignatureService>();
builder.Services.AddScoped<DashboardService>();

await builder.Build().RunAsync();
