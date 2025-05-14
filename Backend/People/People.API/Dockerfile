# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and project files
COPY People.sln .
COPY People.API/People.API.csproj People.API/
COPY People.Data/People.Data.csproj People.Data/
COPY People.Domain/People.Domain.csproj People.Domain/
COPY People.Messaging/People.Messaging.csproj People.Messaging/

# Restore dependencies for the solution
RUN dotnet restore People.sln

# Copy the rest of the application code
COPY . .

# Publish the specific API project
WORKDIR /src/People.API
RUN dotnet publish People.API.csproj -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "People.API.dll"] 