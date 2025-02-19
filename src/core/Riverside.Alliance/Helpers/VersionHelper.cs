using System.Reflection;
using System.Diagnostics;

namespace Riverside.Alliance.Helpers;

public static class VersionHelper
{
	public static int GetApiVersion()
	{
		var assembly = Assembly.GetExecutingAssembly();
		var fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
		return fileVersionInfo.FileMajorPart;
	}
}
