using System.Reflection;
using System.Diagnostics;

namespace Republic.Helpers
{
	public class GetVersion
	{
		public static int GetApiVersion()
		{
			Assembly assembly = Assembly.GetExecutingAssembly();
			FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
			return fileVersionInfo.FileMajorPart;
		}
	}
}
