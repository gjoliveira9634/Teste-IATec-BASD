# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["BFF.API/*.csproj", "BFF.API/"]
RUN dotnet restore "BFF.API/BFF.API.csproj"
COPY . .
WORKDIR "/src/BFF.API"
RUN dotnet publish -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BFF.API.dll"]