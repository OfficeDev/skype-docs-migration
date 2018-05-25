using System;
using Microsoft.SfB.PlatformService.SDK.Common;

namespace Microsoft.SfB.PlatformService.SDK.Tests
{
    internal class ConsoleLogger : IPlatformServiceLogger
    {
        public bool HttpRequestResponseNeedsToBeLogged { get; set; }

        public void Error(string message)
        {
            Console.WriteLine(DateTime.Now + " [ERROR] " + message);
        }

        public void Error(string fmt, params object[] vars)
        {
            string message = string.Format(fmt, vars);
            Console.WriteLine(DateTime.Now + " [ERROR] " + message);
        }

        public void Error(Exception exception, string fmt, params object[] vars)
        {
            string message = string.Format(fmt, vars);
            Console.WriteLine(DateTime.Now + " [ERROR] " + exception.Message + " " + message);
        }

        public void Information(string message)
        {
            Console.WriteLine(DateTime.Now + " [INFO] " + message);
        }

        public void Information(string fmt, params object[] vars)
        {
            string message = string.Format(fmt, vars);
            Console.WriteLine(DateTime.Now + " [INFO] " + message);
        }

        public void Information(Exception exception, string fmt, params object[] vars)
        {
            string message = string.Format(fmt, vars);
            Console.WriteLine(DateTime.Now + " [INFO] " + exception.Message + message);
        }

        public void Warning(string message)
        {
            Console.WriteLine(DateTime.Now + " [WARN] " + message);
        }

        public void Warning(string fmt, params object[] vars)
        {
            string message = string.Format(fmt, vars);
            Console.WriteLine(DateTime.Now + " [WARN] " + message);
        }

        public void Warning(Exception exception, string fmt, params object[] vars)
        {
            string message = string.Format(fmt, vars);
            Console.WriteLine(DateTime.Now + " [WARN] " + exception.Message + message);
        }
    }
}
