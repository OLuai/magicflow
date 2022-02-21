#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/IA.MagicSuite.Migrator/IA.MagicSuite.Migrator.csproj", "src/IA.MagicSuite.Migrator/"]
COPY ["src/IA.MagicSuite.EntityFrameworkCore/IA.MagicSuite.EntityFrameworkCore.csproj", "src/IA.MagicSuite.EntityFrameworkCore/"]
COPY ["src/IA.MagicSuite.Core/IA.MagicSuite.Core.csproj", "src/IA.MagicSuite.Core/"]
COPY ["src/IA.MagicSuite.Core.Shared/IA.MagicSuite.Core.Shared.csproj", "src/IA.MagicSuite.Core.Shared/"]
RUN dotnet restore "src/IA.MagicSuite.Migrator/IA.MagicSuite.Migrator.csproj"
COPY . .
WORKDIR "/src/src/IA.MagicSuite.Migrator"
RUN dotnet build "IA.MagicSuite.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IA.MagicSuite.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IA.MagicSuite.Migrator.dll"]
