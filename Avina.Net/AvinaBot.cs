using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using System.Windows;

namespace WpfApp1
{
    static class AvinaBot
    {
        static string token = "MzgyMjg4MTg3OTkwNzM2OTE2.Dss_kg.JfL0G1hi6uaeWCdCsm9xgp0yRm8";
        private static DiscordSocketClient _Client;

        public static async void Initialize()
        {
            MessageBox.Show("Bot Initializing...");
            _Client = new DiscordSocketClient();
            _Client.Ready += Ready;
            _Client.LoggedIn += LoggedIn;
            _Client.GuildAvailable += GuildUpdated;
            _Client.Connected += Connected;
            _Client.Disconnected += Disconnected;

            try
            {
                await _Client.LoginAsync(TokenType.Bot, token, true);
                await _Client.StartAsync();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private static async Task Ready() {
            MessageBox.Show("Bot Ready!");
        }

        private static async Task LoggedIn()
        {
            MessageBox.Show("Bot Looged In!");
        }

        private static async Task Connected()
        {
            MessageBox.Show("Bot Connected!");
        }

        private static async Task Disconnected(Exception e)
        {
            //MessageBox.Show(e.Message, "Bot Disconnected!");
        }

        private static async Task GuildUpdated(SocketGuild now)
        {
            MessageBox.Show(now.Name, "Bot Guild Updated!");
        }

        public static Dictionary<string, string> GetGuildNames(List<string> snowflakes)
        {
            var names = new Dictionary<string, string>();
            foreach(string snowflake in snowflakes) {
                ulong id = ulong.Parse(snowflake);
                SocketGuild guild = _Client.GetGuild(id);
                if(guild != null && guild.Name != null)
                    names.Add(snowflake, guild.Name);
            }
            return names;
        }
    }
}
