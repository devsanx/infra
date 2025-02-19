using Discord;

namespace Republic.Common;

public interface IEmbedProvider
{
	Embed Build();
}