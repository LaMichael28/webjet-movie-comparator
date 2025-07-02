using System;
using System.Text.Json;
using System.Text.Json.Serialization; 

public class DecimalFromStringConverter : JsonConverter<decimal>
{
    public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String &&
            decimal.TryParse(reader.GetString(), out var value))
        {
            return value;
        }

        if (reader.TokenType == JsonTokenType.Number)
        {
            return reader.GetDecimal();
        }

        throw new JsonException($"Cannot convert to decimal. TokenType: {reader.TokenType}");
    }

    public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(value);
    }
}
