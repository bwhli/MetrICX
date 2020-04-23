using System;

namespace ICXIScoreChangedTEST
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            var func = new ICXIScoreChangedFunction.Function();
            func.ProcessRecordAsync(null).Wait();
        }
    }
}
