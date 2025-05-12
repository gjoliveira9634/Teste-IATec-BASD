# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Account.sln .
COPY Account.API/Account.API.csproj Account.API/
COPY Account.Data/Account.Data.csproj Account.Data/
COPY Account.Domain/Account.Domain.csproj Account.Domain/
COPY Account.Messaging/Account.Messaging.csproj Account.Messaging/

# Restore dependencies for the solution
RUN dotnet restore Account.sln

# Copy the rest of the application code
COPY . .

# Publish the specific API project
WORKDIR /src/Account.API
RUN dotnet publish Account.API.csproj -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Account.API.dll"]