namespace ToDo
{
    public class Program
    {
        public static string SecurityKey = "abcdefgh12345678";
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls("http://localhost:5178").UseStartup<Startup>();
                });
    }

}
