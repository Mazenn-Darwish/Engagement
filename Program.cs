using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using INV;
using INV.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped<RsvpService>();
builder.Services.AddScoped<SongService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<SignatureService>();
builder.Services.AddScoped<DashboardService>();

await builder.Build().RunAsync();
