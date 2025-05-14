# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Transaction.sln .
COPY Transaction.API/Transaction.API.csproj Transaction.API/
COPY Transaction.Data/Transaction.Data.csproj Transaction.Data/
COPY Transaction.Domain/Transaction.Domain.csproj Transaction.Domain/
COPY Transaction.Messaging/Transaction.Messaging.csproj Transaction.Messaging/

# Restore dependencies for the solution
RUN dotnet restore Transaction.sln

# Copy the rest of the application code
COPY . .

# Publish the specific API project
WORKDIR /src/Transaction.API
RUN dotnet publish Transaction.API.csproj -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Transaction.API.dll"] 