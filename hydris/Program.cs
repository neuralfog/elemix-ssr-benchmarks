var app = new Hydris.App();

await app.Serve(int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "3000"));
