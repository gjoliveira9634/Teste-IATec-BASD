# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["BFF.sln", "./"]
COPY ["BFF.API/BFF.API.csproj", "BFF.API/"]
COPY ["BFF.Cache/BFF.Cache.csproj", "BFF.Cache/"]
RUN dotnet restore "BFF.sln"

# Copy remaining source code
COPY . .
# Publish API project
WORKDIR "/src/BFF.API"
RUN dotnet publish -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BFF.API.dll"]