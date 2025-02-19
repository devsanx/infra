namespace Republic.Portals.DB;

public class KVStore
{
	public ulong Id { get; set; }
	public string Key { get; set; } = string.Empty;
	public string Value { get; set; } = string.Empty;
}