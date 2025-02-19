using Discord;

namespace Riverside.Alliance.Common;

public interface IEmbedProvider
{
	Embed Build();
}