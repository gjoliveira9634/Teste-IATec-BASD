# build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Transaction.API/*.csproj", "Transaction.API/"]
RUN dotnet restore "Transaction.API/Transaction.API.csproj"
COPY . .
WORKDIR "/src/Transaction.API"
RUN dotnet publish -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Transaction.API.dll"]