# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["People.API/*.csproj", "People.API/"]
RUN dotnet restore "People.API/People.API.csproj"
COPY . .
WORKDIR "/src/People.API"
RUN dotnet publish -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "People.API.dll"]