using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace WpfApp1
{
    public static class CustomCommands
    {
        public static RoutedCommand Database_Connect = new RoutedCommand();
        public static RoutedCommand Database_ManageConnections = new RoutedCommand();
    }
}
